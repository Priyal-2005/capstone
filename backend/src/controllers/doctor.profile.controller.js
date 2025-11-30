const prisma = require("../config/prisma");

const getDoctorProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const doctor = await prisma.doctor.findUnique({
            where: {userId}
        });

        if (!doctor) {
            return res.status(404).json({message: "Doctor profile not found"});
        }

        return res.json({data: doctor});
    }
    catch (err) {
        res.status(500).json({ error: "Server error" });
    }
};

const createDoctorProfile = async (req, res) => {
    try {
        const { specialization } = req.body;
        const userId = req.user.id;

        const exists = await prisma.doctor.findUnique({
            where: {userId} 
        });

        if (exists) return res.status(400).json({ message: "Doctor profile already exists" });

        const doctor = await prisma.doctor.create({
            data: {
                userId,
                specialization
            }
        });

        return res.json({
            message: "Doctor profile created",
            data: doctor
        });
    }
    catch (err) {
        res.status(500).json({error: "Server error"});
    }
};

const updateDoctorProfile = async (req, res) => {
    try {
        const { specialization } = req.body;
        const userId = req.user.id;

        const doctor = await prisma.doctor.update({
            where: { userId },
            data: { specialization }
        });

        return res.json({
            message: "Doctor profile updated",
            data: doctor
        });
    }
    catch (err) {
        res.status(500).json({error: "Server error"});
    }
};

module.exports = {
    getDoctorProfile,
    createDoctorProfile,
    updateDoctorProfile
}