const jwt = require('jsonwebtoken');
const session = require('express-session');

module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch {
        req.session.error = "Log in before you try to access this content"
        console.log("Authentication error (checkAuth): " + req.session.error);
        return res.status(401).redirect('/login');
    }
};