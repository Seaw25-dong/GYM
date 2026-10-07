import nodemailer from "nodemailer";

async function deliverMail(transporter, message) {
  let timeout;
  try {
    return await Promise.race([
      transporter.sendMail(message),
      new Promise((_, reject) => {
        timeout = setTimeout(() => {
          transporter.close();
          reject(Object.assign(new Error("Email delivery timed out"), { code: "ETIMEDOUT" }));
        }, 15000);
      }),
    ]);
  } finally {
    clearTimeout(timeout);
  }
}

async function sendVerificationEmail({ email, verificationUrl }) {
  if (!process.env.SMTP_HOST) {
    if (process.env.NODE_ENV === "production") {
      throw Object.assign(new Error("SMTP_HOST is not configured"), { code: "EMAIL_NOT_CONFIGURED" });
    }
    console.log(`Email verification link for ${email}: ${verificationUrl}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 10000,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  const configuredFrom = process.env.MAIL_FROM?.trim();
  const from =
    configuredFrom && !configuredFrom.includes("example.com")
      ? configuredFrom
      : process.env.SMTP_USER
        ? `AI Gym Coach <${process.env.SMTP_USER}>`
        : "AI Gym Coach <no-reply@ai-gym-coach.local>";

  await deliverMail(transporter, {
    from,
    to: email,
    subject: "Xác thực tài khoản AI Gym Coach",
    text: `Link xác thực tài khoản của bạn có hiệu lực trong 10 phút:\n${verificationUrl}`,
    html: `
      <p>Chào bạn,</p>
      <p>Bấm vào link bên dưới để xác thực tài khoản AI Gym Coach. Link có hiệu lực trong 10 phút.</p>
      <p><a href="${verificationUrl}">Xác thực tài khoản</a></p>
      <p>Nếu bạn không đăng ký tài khoản, hãy bỏ qua email này.</p>
    `,
  });
}

async function sendPasswordResetEmail({ email, resetUrl }) {
  return sendActionEmail({
    email,
    subject: "Đặt lại mật khẩu AI Gym Coach",
    text: `Link đặt lại mật khẩu có hiệu lực trong 15 phút:\n${resetUrl}`,
    html: `<p>Bấm vào link bên dưới để đặt lại mật khẩu. Link có hiệu lực trong 15 phút.</p><p><a href="${resetUrl}">Đặt lại mật khẩu</a></p><p>Nếu bạn không yêu cầu, hãy bỏ qua email này.</p>`,
  });
}

async function sendActionEmail({ email, subject, text, html }) {
  if (!process.env.SMTP_HOST) {
    console.log(`${subject} for ${email}: ${text}`);
    return;
  }
  const transporter = nodemailer.createTransport({
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
    dnsTimeout: 10000,
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === "true",
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
  });
  const from = process.env.MAIL_FROM?.trim() || `AI Gym Coach <${process.env.SMTP_USER}>`;
  await deliverMail(transporter, { from, to: email, subject, text, html });
}

export { sendPasswordResetEmail, sendVerificationEmail };
