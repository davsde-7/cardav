const jwt = require('jsonwebtoken');
const session = require('express-session');

module.exports = (req, res, next) => {
    try {
        // Verify the cookie (if user has cookie/is logged in) and save the data to req.userData
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch {
        // Cookie is not valid or there is no cookie, redirect to login and show error message
        req.session.error = "Log in before you try to access this content"
        console.log("Authentication error (checkAuth): " + req.session.error);
        return res.status(401).redirect('/login');
    }
};