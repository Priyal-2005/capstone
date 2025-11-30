const prisma = require("../config/prisma");

const bookAppointment = async (req, res) => {
    try {
        const {doctorId, dateTime} = req.body;

        const appointment = await prisma.appointment.create({
            data: {
                doctorId,
                patientId: req.user.id,
                dateTime: new Date(dateTime),
            }
        })
        return res.status(201).json({message: "Appointment booked successfully", data: appointment});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const pastAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId: req.user.id,
                dateTime: {lt: new Date()}
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true
                    }
                }
            },
        })

        return res.status(200).json({data: appointments})
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const upcomingAppointments = async (req, res) => {
    try {
        const appointments = await prisma.appointment.findMany({
            where: {
                patientId: req.user.id,
                dateTime: {gte: new Date()}
            },
            include: {
                doctor: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        specialization: true
                    }
                }
            }
        })

        return res.status(200).json({data: appointments})
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    bookAppointment,
    pastAppointments,
    upcomingAppointments
}