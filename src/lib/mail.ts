import nodemailer from "nodemailer";
let cachedTransporter: nodemailer.Transporter | null = null;

export type SendSignupVerificationOutcome =
  | { channel: "remote"; provider: "gmail" | "smtp" }
  | { channel: "dev_console" };

function getTransporter(): {
  transporter: nodemailer.Transporter | null;
  provider: "gmail" | "smtp" | null;
} {
  if (cachedTransporter) {
    return { transporter: cachedTransporter, provider: "gmail" };
  }

  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();

  if (emailUser && emailPass) {
    cachedTransporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: emailUser,
        pass: emailPass,
      },
    });
    return { transporter: cachedTransporter, provider: "gmail" };
  }

  const host = process.env.SMTP_HOST?.trim();
  const portRaw = process.env.SMTP_PORT?.trim();
  if (host && portRaw) {
    const port = Number(portRaw);
    if (!Number.isFinite(port)) {
      throw new Error("Invalid SMTP_PORT value.");
    }
    const secure =
      process.env.SMTP_SECURE === "true" ||
      process.env.SMTP_SECURE === "1" ||
      port === 465;
    cachedTransporter = nodemailer.createTransport({
      host,
      port,
      secure,
      requireTLS: port === 587 && !secure,
      auth:
        process.env.SMTP_USER && process.env.SMTP_PASS
          ? {
              user: process.env.SMTP_USER,
              pass: process.env.SMTP_PASS,
            }
          : undefined,
    });
    return { transporter: cachedTransporter, provider: "smtp" };
  }

  return { transporter: null, provider: null };
}

function createVerificationEmailHtml(code: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Email</title>
</head>
<body style="margin:0;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;background-color:#f4f4f4;color:#333333;">
  <table role="presentation" style="border-collapse:collapse;width:100%;max-width:600px;margin:20px auto;background-color:#ffffff;border-radius:8px;">
    <tr>
      <td style="background-color:#007bff;color:#ffffff;padding:20px;text-align:center;border-top-left-radius:8px;border-top-right-radius:8px;">
        <h1 style="margin:0;">Verification Code</h1>
      </td>
    </tr>
    <tr>
      <td style="padding:30px;text-align:center;">
        <p>Hello User,</p>
        <p>Your unique verification code is:</p>
        <div style="font-size:24px;font-weight:bold;color:#007bff;margin:20px 0;padding:10px;background-color:#f0f6ff;border-radius:4px;display:inline-block;letter-spacing:0.18em;">${code}</div>
        <p>It expires in 15 minutes.</p>
      </td>
    </tr>
    <tr>
      <td style="padding:20px;text-align:center;font-size:12px;color:#666666;background-color:#f4f4f4;border-bottom-left-radius:8px;border-bottom-right-radius:8px;">
        <p>This is an automated message. Please do not reply directly to this email.</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export async function sendSignupVerificationEmail(
  to: string,
  code: string
): Promise<SendSignupVerificationOutcome> {
  const { transporter, provider } = getTransporter();

  if (!transporter || !provider) {
    if (process.env.NODE_ENV === "development") {
      console.info(`[email] Signup verification for ${to}: ${code}`);
      return { channel: "dev_console" };
    }
    throw new Error(
      "Email not configured. Set EMAIL_USER/EMAIL_PASS or SMTP settings."
    );
  }

  const from =
    process.env.EMAIL_FROM?.trim() ||
    (process.env.EMAIL_USER
      ? `"CareerUs Interview" <${process.env.EMAIL_USER}>`
      : '"CareerUs Interview" <noreply@localhost>');

  await transporter.sendMail({
    from,
    to,
    subject: "Signup Verification Code",
    text: `Your verification code is ${code}. It expires in 15 minutes.`,
    html: createVerificationEmailHtml(code),
  });

  return { channel: "remote", provider };
}
