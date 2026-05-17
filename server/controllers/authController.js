const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuditLog = require('../models/AuditLog');
const PasswordResetToken = require('../models/PasswordResetToken');
const { sendEmail } = require('../utils/email');

const createToken = (user) => {
  let secret = process.env.JWT_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('JWT_SECRET is not configured. Set JWT_SECRET in your environment variables.');
    }
    secret = 'dev-goalsync-secret';
    console.warn('[Auth] JWT_SECRET is missing. Using development fallback secret. Configure JWT_SECRET for production.');
  }

  return jwt.sign({ id: user._id, role: user.role }, secret, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('[Auth] Register request for:', normalizedEmail);

    const existing = await User.findOne({ email: normalizedEmail });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered.' });
    }

    const user = new User({ name: name.trim(), email: normalizedEmail, password, role: role || 'employee' });
    await user.save();
    await AuditLog.create({ user: user._id, action: 'User registered', resource: 'User', details: `${user.name} created` });

    const token = createToken(user);
    res.status(201).json({ user: { id: user._id, name: user.name, email: user.email, role: user.role }, token });
  } catch (error) {
    console.error('[Auth] Register error:', error.message);
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('[Auth] Login attempt for:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = createToken(user);
    await AuditLog.create({ user: user._id, action: 'User logged in', resource: 'Auth' });
    res.json({ user: { id: user._id, name: user.name, email: user.email, role: user.role, team: user.team, department: user.department }, token });
  } catch (error) {
    console.error('[Auth] Login error:', error.message);
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'Email is required.' });
    }

    const normalizedEmail = email.toLowerCase().trim();
    console.log('[Auth] Forgot password request for:', normalizedEmail);

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(200).json({ message: 'If that email exists, we have sent reset instructions.' });
    }

    const rawToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60);

    await PasswordResetToken.create({
      user: user._id,
      token: rawToken,
      expiresAt,
    });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password?token=${rawToken}`;
    const message = `Use the link below to reset your password. This link expires in one hour.\n\n${resetUrl}`;
    const html = `
      <div style="font-family: Inter, system-ui, sans-serif; color: #0f172a;">
        <h2 style="color: #0f172a;">GoalSync password reset</h2>
        <p>Click below to securely reset your password. The link will expire in 60 minutes.</p>
        <a href="${resetUrl}" style="display:inline-block;margin-top:20px;padding:14px 24px;border-radius:9999px;background:#2563eb;color:#fff;text-decoration:none;">Reset password</a>
        <p style="margin-top:24px;color:#475569;">If you did not request this, you can safely ignore this email.</p>
      </div>
    `;

    const info = await sendEmail({
      to: user.email,
      subject: 'Reset your GoalSync password',
      text: message,
      html,
    });

    await AuditLog.create({ user: user._id, action: 'Password reset requested', resource: 'Auth' });
    console.log('[Auth] Password reset email sent to:', user.email, 'preview:', info.messageId || 'none');

    res.json({ message: 'If that email exists, we have sent reset instructions.' });
  } catch (error) {
    console.error('[Auth] Forgot password error:', error.message, error.stack);
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required.' });
    }

    const resetRecord = await PasswordResetToken.findOne({ token, used: false });
    if (!resetRecord || resetRecord.expiresAt < new Date()) {
      return res.status(400).json({ message: 'Reset token is invalid or has expired.' });
    }

    const user = await User.findById(resetRecord.user);
    if (!user) {
      return res.status(400).json({ message: 'Invalid reset request.' });
    }

    user.password = password;
    await user.save();
    resetRecord.used = true;
    await resetRecord.save();

    await AuditLog.create({ user: user._id, action: 'Password reset completed', resource: 'Auth' });

    res.json({ message: 'Your password has been reset successfully.' });
  } catch (error) {
    console.error('[Auth] Reset password error:', error.message, error.stack);
    next(error);
  }
};
