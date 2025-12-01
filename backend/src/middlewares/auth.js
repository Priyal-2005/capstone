const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require("../utils/jwt");

function isAuth(req, res, next) {
    try {
        const token = req.cookies.accessToken;
        if (!token) {
            return res.status(401).json({ message: "No access token" });
        }
        const decoded = verifyAccessToken(token);

        if (!decoded) {
            return res.status(401).json({ message: "Invalid or expired token" });
        }

        req.user = decoded;
        next()
    }
    catch (error) {
        return res.status(401).json({message: "Invalid/Expired token"});
    }
}

module.exports = {
    isAuth
};