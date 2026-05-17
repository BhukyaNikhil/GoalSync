const nodemailer = require('nodemailer');

let cachedTransporter = null;

const createTransporter = async () => {
  if (cachedTransporter) return cachedTransporter;

  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS, EMAIL_FROM, NODE_ENV } = process.env;

  if (EMAIL_HOST && EMAIL_PORT && EMAIL_USER && EMAIL_PASS) {
    cachedTransporter = nodemailer.createTransport({
      host: EMAIL_HOST,
      port: Number(EMAIL_PORT),
      secure: Number(EMAIL_PORT) === 465,
      auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
      },
    });
    return cachedTransporter;
  }

  if (NODE_ENV !== 'production') {
    const account = await nodemailer.createTestAccount();
    cachedTransporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: {
        user: account.user,
        pass: account.pass,
      },
    });
    console.warn('[Email] Using Ethereal test account. Preview messages from the log.');
    return cachedTransporter;
  }

  throw new Error('Email transport is not configured. Set EMAIL_HOST, EMAIL_PORT, EMAIL_USER and EMAIL_PASS.');
};

const sendEmail = async ({ to, subject, text, html }) => {
  const transporter = await createTransporter();
  const info = await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'GoalSync <no-reply@goalsync.com>',
    to,
    subject,
    text,
    html,
  });

  if (process.env.NODE_ENV !== 'production' && info.messageId) {
    const preview = nodemailer.getTestMessageUrl(info);
    if (preview) {
      console.log('[Email] Preview URL:', preview);
    }
  }

  return info;
};

module.exports = { sendEmail };
