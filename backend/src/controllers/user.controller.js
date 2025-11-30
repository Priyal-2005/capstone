const prisma = require("../config/prisma");

async function getUser(req, res) {
    try {
        const user = await prisma.user.findUnique({
            where: {id: req.user.id},
            select: {id: true, name: true, email: true, role: true}
        })
        return res.json({data: user})
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    getUser
};