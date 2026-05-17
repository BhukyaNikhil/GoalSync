const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const role = req.user?.role;
    if (!role || !allowedRoles.includes(role)) {
      return res.status(403).json({ message: 'Access denied for this resource' });
    }
    next();
  };
};

module.exports = requireRole;
