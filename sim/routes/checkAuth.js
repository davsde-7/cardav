const jwt = require('jsonwebtoken');
const session = require('express-session')

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch {
        req.session.error = "Unauthorized access"
        console.log("authError checkAuth: "+ req.session.error);
        return res.status(401).redirect('/login');
    }
};