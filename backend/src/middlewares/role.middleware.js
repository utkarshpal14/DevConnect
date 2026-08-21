/**
 * Role-based access control middleware
 * @param  {...string} allowedRoles Roles allowed to access the endpoint
 */
const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required before authorization'
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Forbidden: Access restricted to [${allowedRoles.join(', ')}] roles`
      });
    }

    next();
  };
};

module.exports = authorizeRoles;
