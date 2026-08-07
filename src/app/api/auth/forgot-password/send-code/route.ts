import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PasswordReset } from "@/models/PasswordReset";
import { sendPasswordResetEmail } from "@/lib/mail";
import { EMAIL_RE, normalizeEmail } from "@/lib/email-validation";
import { generateSixDigitCode } from "@/lib/signup-code";

const COOLDOWN_MS = 60_000;
const CODE_TTL_MS = 15 * 60_000;

const GENERIC_OK_MESSAGE =
  "If an account exists for this email, we sent a 6-digit reset code.";

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

    const user = await User.findOne({ email }).lean();
    if (!user) {
      return NextResponse.json({
        ok: true,
        message: GENERIC_OK_MESSAGE,
      });
    }

    const now = new Date();
    const existingPending = await PasswordReset.findOne({ email });
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

    await PasswordReset.findOneAndUpdate(
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

    let outcome: Awaited<ReturnType<typeof sendPasswordResetEmail>>;
    try {
      outcome = await sendPasswordResetEmail(email, plainCode);
    } catch (mailErr) {
      console.error("sendPasswordResetEmail", mailErr);
      await PasswordReset.deleteOne({ email });
      const detail =
        mailErr instanceof Error ? mailErr.message : String(mailErr);
      return NextResponse.json(
        {
          error:
            "Could not send the reset email. Check the server log for details.",
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
          "Email is not configured. Open the terminal where the dev server runs to see your reset code, or set EMAIL_USER/EMAIL_PASS (or SMTP settings) in .env.",
      });
    }

    return NextResponse.json({
      ok: true,
      message: GENERIC_OK_MESSAGE,
    });
  } catch (err) {
    console.error("forgot-password/send-code", err);
    const message =
      err instanceof Error && err.message.includes("MONGODB_URI")
        ? "Database is not configured on the server."
        : err instanceof Error &&
            (err.message.includes("querySrv") ||
              err.message.includes("ECONNREFUSED"))
          ? "Could not connect to the database. Please try again in a moment."
          : "Something went wrong. Please try again.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
