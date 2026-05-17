const errorHandler = (err, req, res, next) => {
  console.error('[Error]', err.name, err.message);
  if (err.code === 11000) {
    return res.status(400).json({ message: 'Duplicate field value. Please use a different value.' });
  }

  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    details: err.details || null,
  });
};

module.exports = errorHandler;
