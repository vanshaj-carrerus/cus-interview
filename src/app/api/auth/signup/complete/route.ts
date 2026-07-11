import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { SignupVerification } from "@/models/SignupVerification";
import { setAuthCookieFromUser } from "@/lib/auth-cookie";
import { toPublicUser } from "@/lib/user-public";
import { EMAIL_RE, normalizeEmail } from "@/lib/email-validation";
import { splitFullName } from "@/lib/billing/checkout-details";
import { normalizeVerificationCode } from "@/lib/signup-code";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
    const name = String(body.name ?? "").trim();
    const codeRaw = String(body.code ?? "");
    const code = normalizeVerificationCode(codeRaw);

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }
    if (!code) {
      return NextResponse.json(
        { error: "Enter the 6-digit code from your email." },
        { status: 400 }
      );
    }
    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    await connectDB();

    const pending = await SignupVerification.findOne({ email });
    if (!pending) {
      return NextResponse.json(
        {
          error:
            "No verification is pending for this email. Request a new code first.",
        },
        { status: 400 }
      );
    }

    if (new Date() > pending.expiresAt) {
      await SignupVerification.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: "That code has expired. Request a new one." },
        { status: 400 }
      );
    }

    const codeValid = await bcrypt.compare(code, pending.codeHash);
    if (!codeValid) {
      pending.attemptsLeft = Math.max(0, pending.attemptsLeft - 1);
      if (pending.attemptsLeft <= 0) {
        await SignupVerification.deleteOne({ _id: pending._id });
        return NextResponse.json(
          {
            error: "Too many incorrect attempts. Request a new verification code.",
          },
          { status: 401 }
        );
      }
      await pending.save();
      return NextResponse.json(
        {
          error: `Invalid code. ${pending.attemptsLeft} attempt${pending.attemptsLeft === 1 ? "" : "s"} left.`,
        },
        { status: 401 }
      );
    }

    const existingUser = await User.findOne({ email }).lean();
    if (existingUser) {
      await SignupVerification.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    await SignupVerification.deleteOne({ _id: pending._id });

    const passwordHash = await bcrypt.hash(password, 12);
    const { firstName, lastName } = splitFullName(name);
    let user;
    try {
      user = await User.create({
        email,
        passwordHash,
        name,
        firstName,
        lastName,
      });
    } catch (createErr: unknown) {
      if (
        typeof createErr === "object" &&
        createErr !== null &&
        "code" in createErr &&
        (createErr as { code: number }).code === 11000
      ) {
        return NextResponse.json(
          { error: "An account with this email already exists." },
          { status: 409 }
        );
      }
      throw createErr;
    }

    const response = NextResponse.json({ user: toPublicUser(user) });
    await setAuthCookieFromUser(response, user);
    return response;
  } catch (err) {
    console.error("signup/complete", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
