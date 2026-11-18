const jwt = require('jsonwebtoken');

// Check whether the user is logged in
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({
            message: 'Access denied. Please log in.'
        });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({
                message: 'Invalid or expired token.'
            });
        }

        req.user = user;
        next();
    });
}

// Check whether the logged-in user is an administrator
function requireAdmin(req, res, next) {
    if (!req.user || req.user.role !== 'Admin') {
        return res.status(403).json({
            message: 'Access denied. Administrator permission required.'
        });
    }

    next();
}

module.exports = {
    authenticateToken,
    requireAdmin
};