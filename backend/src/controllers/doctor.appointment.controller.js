const prisma = require("../config/prisma");

const getTodayAppointments = async(req, res) => {
    try {
        const doctorUserId = req.user.id;

        const doctor = await prisma.doctor.findUnique({
            where: {userId: doctorUserId}
        })

        if(!doctor) {
            return res.status(404).json({message: "Doctor not found"});
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await prisma.appointment.findMany({
            where: {
              doctorId: doctor.id,
              dateTime: {
                gte: today,
                lt: tomorrow
            }},
            orderBy: { dateTime: 'asc' },
            include: {
              patient: {select:{
                id: true,
                name: true,
                email: true
            }}}
          });

        return res.json({data: appointments})
    }
    catch (error) {
        console.error("Error fetching today's appointments:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const updateAppointmentStatus = async(req, res) => {
    try {
        const {appointmentId, status} = req.body;
        const doctorUserId = req.user.id;

        const doctor = await prisma.doctor.findUnique({
            where: {userId: doctorUserId}
        })

        const appointment = await prisma.appointment.findUnique({
            where: {id: appointmentId}
        })

        if (!appointment || appointment.doctorId !== doctor.id) {
            return res.status(404).json({message: "Appointment not found"});
        }

        const updatedAppointment = await prisma.appointment.update({
            where: {id: appointmentId},
            data: {status}
        });

        return res.json({
            message: "Appointment status updated successfully",
            data: updatedAppointment
        });
    }
    catch (error) {
        console.error("Error updating appointment status:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

const getUpcomingAppointments = async(req, res) => {
    try {
        const doctorUserId = req.user.id;

        const doctor = await prisma.doctor.findUnique({
            where: {userId: doctorUserId}
        })

        const appointments = await prisma.appointment.findMany({
            where: {
              doctorId: doctor.id,
              dateTime: {gte: new Date()}
            },
            orderBy: {dateTime: 'asc'},
            include: {
              patient: { select: { id: true, name: true, email: true } }
            }
        });

        return res.json({data: appointments});
    }
    catch (error) {
        console.error("Error fetching upcoming appointments:", error);
        return res.status(500).json({message: "Internal server error"});
    }
}

module.exports = {
    getTodayAppointments,
    updateAppointmentStatus,
    getUpcomingAppointments
}