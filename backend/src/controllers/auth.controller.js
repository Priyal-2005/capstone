const prisma = require("../config/prisma");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {generateAccessToken, generateRefreshToken} = require("../utils/jwt");

// register
async function register(req, res) {
    try {
        const {name, email, password, role} = req.body;

        if (!name || !email || !password || !role) {
            return res.status(400).json({message: "Please provide all required fields"});
        }

        const exists = await prisma.user.findUnique({
            where: {email}
        })
        if (exists) {
            return res.status(400).json({message: "User already exists"});
        }

        const hash = await bcrypt.hash(password, 10);
        await prisma.user.create({
            data: {
                name,
                email,
                password: hash,
                role: role?.toUpperCase() || "PATIENT"
            }
        });

        return res.status(201).json({message: "User registered successfully"});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"});
    }
}

// login
async function login(req, res) {
    try {
        const {email, password} = req.body;

        const user = await prisma.user.findUnique({
            where: {email}
        })
        if (!user) {
            return res.status(400).json({message: "User not found"});
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({message: "Invalid credentials"});
        }

        // Generate tokens
        const accessToken = generateAccessToken({
            id: user.id,
            role: user.role
        });
        
        const refreshToken = generateRefreshToken({
            id: user.id,
            role: user.role
        });

        return res.json({
            message: "Login successful",
            accessToken,
            refreshToken,
            role: user.role,
            name: user.name
        })
    }
    catch {
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const refresh = (req, res) => {
    const {refreshToken} = req.body;

    const decoded = jwt.verify(refreshToken);

    if (!decoded) {
        return res.status(401).json({message: "Invalid refresh token"});
    }

    const newAccess = generateAccessToken({
        id: decoded.id,
        role: decoded.role
    })

    return res.json({
        accessToken: newAccess
    });
}

module.exports = {
    register,
    login
}