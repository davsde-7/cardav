const jwt = require('jsonwebtoken');
const session = require('express-session');

/* Specific authentication check made only for the index/home page*/
module.exports = (req, res, next) => {
    try {
        const decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        req.userData = decoded;
        next();
    }
    catch {
        return res.render('index');
    }
};