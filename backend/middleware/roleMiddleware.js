const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403); // Forbidden
      throw new Error(`Role (${req.user ? req.user.role : 'None'}) is not authorized to access this resource`);
    }
    next();
  };
};

module.exports = { authorize };
