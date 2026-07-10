import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";
import { PasswordReset } from "@/models/PasswordReset";
import { setAuthCookieFromUser } from "@/lib/auth-cookie";
import { toPublicUser } from "@/lib/user-public";
import { EMAIL_RE, normalizeEmail } from "@/lib/email-validation";
import { normalizeVerificationCode } from "@/lib/signup-code";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(String(body.email ?? ""));
    const password = String(body.password ?? "");
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

    const pending = await PasswordReset.findOne({ email });
    if (!pending) {
      return NextResponse.json(
        {
          error:
            "No password reset is pending for this email. Request a new code first.",
        },
        { status: 400 }
      );
    }

    if (new Date() > pending.expiresAt) {
      await PasswordReset.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: "That code has expired. Request a new one." },
        { status: 400 }
      );
    }

    const codeValid = await bcrypt.compare(code, pending.codeHash);
    if (!codeValid) {
      pending.attemptsLeft = Math.max(0, pending.attemptsLeft - 1);
      if (pending.attemptsLeft <= 0) {
        await PasswordReset.deleteOne({ _id: pending._id });
        return NextResponse.json(
          {
            error: "Too many incorrect attempts. Request a new reset code.",
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

    const user = await User.findOne({ email }).select("+passwordHash");
    if (!user) {
      await PasswordReset.deleteOne({ _id: pending._id });
      return NextResponse.json(
        { error: "No account found for this email." },
        { status: 404 }
      );
    }

    await PasswordReset.deleteOne({ _id: pending._id });

    user.passwordHash = await bcrypt.hash(password, 12);
    await user.save();

    const response = NextResponse.json({
      user: toPublicUser(user),
      message: "Your password has been reset.",
    });
    await setAuthCookieFromUser(response, user);
    return response;
  } catch (err) {
    console.error("forgot-password/reset", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
