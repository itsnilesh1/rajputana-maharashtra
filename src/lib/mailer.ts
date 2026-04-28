import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export async function sendPasswordResetEmail(
  toEmail: string,
  toName: string,
  resetToken: string
) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

  await transporter.sendMail({
    from: `"Rajputana Maharashtra" <${process.env.GMAIL_USER}>`,
    to: toEmail,
    subject: 'Password Reset Request – Rajputana Maharashtra',
    html: `
      <!DOCTYPE html>
      <html>
      <body style="margin:0;padding:0;background:#0a0a0a;font-family:Georgia,serif;">
        <div style="max-width:600px;margin:40px auto;background:#111;border:1px solid #8B1A1A;border-radius:8px;overflow:hidden;">
          <div style="background:linear-gradient(135deg,#1a0a0a,#2d0000);padding:30px;text-align:center;border-bottom:2px solid #C9A84C;">
            <h1 style="color:#C9A84C;margin:0;font-size:22px;letter-spacing:2px;">⚔️ RAJPUTANA MAHARASHTRA</h1>
            <p style="color:#8B1A1A;margin:6px 0 0;font-size:12px;letter-spacing:3px;">ROYAL COMMUNITY PLATFORM</p>
          </div>
          <div style="padding:36px 32px;">
            <h2 style="color:#C9A84C;margin:0 0 16px;">Password Reset Request</h2>
            <p style="color:#ccc;line-height:1.7;">Jai Rajputana, <strong style="color:#fff;">${toName}</strong>,</p>
            <p style="color:#ccc;line-height:1.7;">We received a request to reset your password. Click the button below to set a new password. This link expires in <strong style="color:#C9A84C;">1 hour</strong>.</p>
            <div style="text-align:center;margin:32px 0;">
              <a href="${resetUrl}" style="background:linear-gradient(135deg,#8B1A1A,#C9A84C);color:#fff;text-decoration:none;padding:14px 36px;border-radius:4px;font-size:15px;font-weight:bold;letter-spacing:1px;display:inline-block;">Reset My Password</a>
            </div>
            <p style="color:#888;font-size:13px;line-height:1.7;">If the button above doesn't work, copy and paste this link into your browser:</p>
            <p style="color:#C9A84C;font-size:12px;word-break:break-all;">${resetUrl}</p>
            <hr style="border:none;border-top:1px solid #333;margin:28px 0;">
            <p style="color:#666;font-size:12px;line-height:1.7;">If you did not request a password reset, please ignore this email. Your account is safe — no changes were made.</p>
            <p style="color:#666;font-size:12px;">For security: this link is single-use and expires in 1 hour.</p>
          </div>
          <div style="background:#0a0a0a;padding:16px;text-align:center;border-top:1px solid #222;">
            <p style="color:#444;font-size:11px;margin:0;">© Rajputana Maharashtra — All Rights Reserved</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Password Reset – Rajputana Maharashtra\n\nJai Rajputana, ${toName},\n\nReset your password here (expires in 1 hour):\n${resetUrl}\n\nIf you did not request this, ignore this email.`,
  });
}
