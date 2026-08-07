import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { SignupVerification } from "@/models/SignupVerification";
import { sendSignupVerificationEmail } from "@/lib/mail";
import { EMAIL_RE, normalizeEmail } from "@/lib/email-validation";
import { generateSixDigitCode } from "@/lib/signup-code";

const COOLDOWN_MS = 60_000;
const CODE_TTL_MS = 15 * 60_000;

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(String(body.email ?? ""));

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    await connectDB();

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    const now = new Date();
    const existingPending = await SignupVerification.findOne({ email });
    if (
      existingPending &&
      now.getTime() - existingPending.lastSentAt.getTime() < COOLDOWN_MS
    ) {
      const waitSec = Math.ceil(
        (COOLDOWN_MS -
          (now.getTime() - existingPending.lastSentAt.getTime())) /
          1000
      );
      return NextResponse.json(
        {
          error: `Please wait ${waitSec} seconds before requesting another code.`,
        },
        { status: 429 }
      );
    }

    const plainCode = generateSixDigitCode();
    const codeHash = await bcrypt.hash(plainCode, 10);
    const expiresAt = new Date(now.getTime() + CODE_TTL_MS);

    await SignupVerification.findOneAndUpdate(
      { email },
      {
        email,
        codeHash,
        expiresAt,
        attemptsLeft: 5,
        lastSentAt: now,
      },
      { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
    );

    let outcome: Awaited<ReturnType<typeof sendSignupVerificationEmail>>;
    try {
      outcome = await sendSignupVerificationEmail(email, plainCode);
    } catch (mailErr) {
      console.error("sendSignupVerificationEmail", mailErr);
      await SignupVerification.deleteOne({ email });
      const detail =
        mailErr instanceof Error ? mailErr.message : String(mailErr);
      return NextResponse.json(
        {
          error:
            "Could not send the verification email. Check the server log for details.",
          detail:
            process.env.NODE_ENV === "development"
              ? detail.slice(0, 400)
              : undefined,
        },
        { status: 502 }
      );
    }

    if (outcome.channel === "dev_console") {
      return NextResponse.json({
        ok: true,
        message:
          "Email is not configured. Open the terminal where the dev server runs to see your verification code, or set EMAIL_USER/EMAIL_PASS (or SMTP settings) in .env.",
      });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("signup/send-code", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
