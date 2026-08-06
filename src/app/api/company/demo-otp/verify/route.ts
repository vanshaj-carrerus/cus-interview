import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/mongodb";
import { DemoOTP } from "@/models/DemoOTP";
import { normalizeEmail } from "@/lib/email-validation";
import { sendDemoRequestNotification } from "@/lib/mail";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Record<string, unknown>;
    const email = normalizeEmail(String(body.email ?? ""));
    const code = String(body.code ?? "").trim();
    const name = String(body.name ?? "").trim();
    const phone = String(body.phone ?? "").trim();
    const companyName = String(body.companyName ?? "").trim();
    const isStudent = Boolean(body.isStudent);

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and code are required." },
        { status: 400 }
      );
    }

    await connectDB();

    const pending = await DemoOTP.findOne({ email });
    if (!pending) {
      return NextResponse.json(
        { error: "No pending verification found for this email. It may have expired." },
        { status: 404 }
      );
    }

    if (pending.attemptsLeft <= 0) {
      await DemoOTP.deleteOne({ email });
      return NextResponse.json(
        { error: "Too many failed attempts. Please request a new code." },
        { status: 403 }
      );
    }

    const isValid = await bcrypt.compare(code, pending.codeHash);
    if (!isValid) {
      pending.attemptsLeft -= 1;
      await pending.save();
      return NextResponse.json(
        {
          error: `Invalid code. ${pending.attemptsLeft} attempt(s) left.`,
        },
        { status: 400 }
      );
    }

    // Success - delete the OTP record
    await DemoOTP.deleteOne({ email });

    try {
      await sendDemoRequestNotification({ name, email, phone, companyName, isStudent });
    } catch (e) {
      console.error("Failed to send demo notification email", e);
    }

    return NextResponse.json({
      ok: true,
      message: "Email verified successfully.",
    });
  } catch (err) {
    console.error("company/demo-otp/verify", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
