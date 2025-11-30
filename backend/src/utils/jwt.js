const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET_KEY;

// Generate Access Token
const generateAccessToken = (payload, expiresIn = "2h") => {
    return jwt.sign(payload, SECRET, { expiresIn });
};

// Generate Refresh Token
const generateRefreshToken = (payload, expiresIn = "7d") => {
    return jwt.sign(payload, SECRET, { expiresIn });
};

// Verify Token
const verifyAccessToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
};

// Verify Refresh Token
const verifyRefreshToken = (token) => {
    try {
        return jwt.verify(token, SECRET);
    } catch (err) {
        return null;
    }
};

module.exports = {
    generateAccessToken,
    verifyAccessToken,
    generateRefreshToken,
    verifyRefreshToken
};