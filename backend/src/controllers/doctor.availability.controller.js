const prisma = require("../config/prisma");

const addAvailability = async (req, res) => {
    try {
        const { dayOfWeek, startTime, endTime } = req.body;
        const userId = req.user.id;

        const doctor = await prisma.doctor.findUnique({
            where: {userId}
        });

        if (!doctor) return res.status(404).json({message: "Doctor profile not found"});

        const slot = await prisma.availability.create({
            data: {
                doctorId: doctor.id,
                dayOfWeek,
                startTime,
                endTime
            }
        });

        return res.json({message: "Availability added", data: slot});
    }
    catch (err) {
        res.status(500).json({error: "Server error"});
    }
};

const getAvailability = async (req, res) => {
    try {
        const userId = req.user.id;

        const doctor = await prisma.doctor.findUnique({
            where: { userId }
        });

        const slots = await prisma.availability.findMany({
            where: {doctorId: doctor.id}
        });

        return res.json({data: slots});
    }
    catch (err) {
        res.status(500).json({error: "Server error"});
    }
};

const deleteAvailability = async (req, res) => {
    try {
        const id = parseInt(req.params.id);

        await prisma.availability.delete({
            where: {id}});

        return res.json({message: "Availability deleted"});
    }
    catch (err) {
        res.status(500).json({error: "Server error"});
    }
};

module.exports = {
    addAvailability,
    getAvailability,
    deleteAvailability
}