const jwt = require('jsonwebtoken');
const { verifyAccessToken } = require("../utils/jwt");

function isAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({message: "No token provided"})
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ message: "Invalid token format" });
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