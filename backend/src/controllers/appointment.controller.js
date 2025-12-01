const prisma = require("../config/prisma");

const bookAppointment = async (req, res) => {
    try {
        const {doctorId, dateTime} = req.body;
        const patientId = req.user.id;

        if (!doctorId || !dateTime) {
            return res.status(400).json({ message: "doctorId and dateTime are required" });
        }

        // parse date
        const requestedDate = new Date(dateTime);
        if (isNaN(requestedDate.getTime())) {
            return res.status(400).json({ message: "Invalid dateTime format." });
        }
        
        const now = new Date();
        if (requestedDate <= now) {
            return res.status(400).json({ message: "dateTime must be in the future" });
        }

        // ensure doctor exists
        const doctor = await prisma.doctor.findUnique({
            where: { id: parseInt(doctorId) }
        });
        if (!doctor) {
            return res.status(404).json({ message: "Doctor not found" });
        }
        // Optional: check conflicts (same doctor + exact same dateTime)
        const conflict = await prisma.appointment.findFirst({
            where: {
            doctorId: doctor.id,
            dateTime: requestedDate
            }
        });
        if (conflict) {
            return res.status(409).json({ message: "That slot is already booked" });
        }
  

        const appointment = await prisma.appointment.create({
            data: {
              patientId,
              doctorId: doctor.id,
              dateTime: requestedDate,
              status: "PENDING"
            },
            include: {
              doctor: {
                include: { user: { select: { name: true, email: true } } }
              },
              patient: { select: { id: true, name: true, email: true } }
            }
        });

        return res.status(201).json({message: "Appointment booked successfully", data: appointment});
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const pastAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;

        const appointments = await prisma.appointment.findMany({
            where: {
                patientId,
                dateTime: {lt: new Date()}
            },
            include: {
                doctor: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true
                      }
                    }
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

const upcomingAppointments = async (req, res) => {
    try {
        const patientId = req.user.id;

        const appointments = await prisma.appointment.findMany({
            where: {
                patientId,
                dateTime: {gte: new Date()}
            },
            include: {
                doctor: {
                  include: {
                    user: {
                      select: {
                        name: true,
                        email: true
                      }
                    }
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