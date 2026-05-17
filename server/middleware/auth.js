const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Authorization token missing' });

  try {
    const secret = process.env.JWT_SECRET || (process.env.NODE_ENV !== 'production' ? 'dev-goalsync-secret' : null);
    if (!secret) {
      return res.status(500).json({ message: 'Authentication secret is not configured.' });
    }
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.id).select('-password');
    if (!user) return res.status(401).json({ message: 'Invalid authentication token' });
    req.user = user;
    next();
  } catch (error) {
    console.error('[Auth] Token validation failed:', error.message);
    return res.status(401).json({ message: 'Session expired or invalid token' });
  }
};

module.exports = authMiddleware;
