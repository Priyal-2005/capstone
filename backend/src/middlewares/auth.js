const jwt = require('jsonwebtoken');

function isValidToken(req, res, next) {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({message: "No token provided"});
        
            const token = authHeader.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);

            req.user = decoded;
            next()

        }
    }
    catch (error) {
        return res.status(401).json({message: "Invalid/Expired token"});
    }
}

module.exports = isValidToken;