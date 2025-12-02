const prisma = require("../config/prisma");
const bcrypt = require("bcrypt");

const createDoctor = async (req, res) => {
  try {
    const {name, email, password, phone, specialization} = req.body;

    const existingUser = await prisma.user.findUnique({
        where: {email}
    });
    if (existingUser) {
      return res.status(400).json({message: "User with this email already exists"});
    }

    const hash = await bcrypt.hash(password, 10);

    // Create User with role DOCTOR
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hash,
        phone,
        role: "DOCTOR"
      }
    });

    // Create Doctor profile
    const doctor = await prisma.doctor.create({
      data: {
        userId: user.id,
        specialization
      }
    });

    return res.json({message: "Doctor created", data: doctor});
  }
  catch (err) {
    console.error(err);
    return res.status(500).json({error: "Server error"});
  }
};


const getAllDoctors = async (req, res) => {
  try {
    const doctors = await prisma.doctor.findMany({
      include: {user: true}
    });

    return res.json({data: doctors});
  }
  catch (err) {
    return res.status(500).json({error: "Server error"});
  }
};


const updateDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const {name, email, phone, specialization} = req.body;

    // Update both User and Doctor tables
    const doctor = await prisma.doctor.update({
      where: {id},
      data: {specialization}
    });

    await prisma.user.update({
      where: {id: doctor.userId},
      data: {name, email, phone}
    });

    return res.json({message: "Doctor updated", data: doctor});
  }
  catch (err) {
    return res.status(500).json({error: "Server error"});
  }
};


const deleteDoctor = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const doctor = await prisma.doctor.findUnique({
        where: {id}
    });
    if (!doctor){
        return res.status(404).json({message: "Doctor not found"});
    }

    // Delete doctor profile
    await prisma.doctor.delete({
        where: {id}
    });

    // Delete user entry
    await prisma.user.delete({
        where: {id: doctor.userId}
    });

    return res.json({message: "Doctor deleted"});
  }
  catch (err) {
    return res.status(500).json({error: "Server error"});
  }
};


const getAllAppointments = async (req, res) => {
  try {
    const appts = await prisma.appointment.findMany({
      include: {
        patient: true,
        doctor: {
          include: {
            user: {
              select: { name: true, email: true, phone: true }
            }
          }
        }
      }
    });

    return res.json({data: appts});
  }
  catch (err) {
    return res.status(500).json({error: "Server error"});
  }
};

const deleteAppointment = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const appointment = await prisma.appointment.findUnique({
      where: {id}
    })

    if (!appointment) {
      return res.status(404).json({message: "Appointment not found"});
    }

    await prisma.appointment.delete({
      where: {id}
    });
    return res.json({message: "Appointment deleted"});
  }
  catch (error) {
    console.log(error);
    return res.status(500).json({error: "Internal Server Error"});
  }
}

module.exports = {
    createDoctor,
    getAllDoctors,
    updateDoctor,
    deleteDoctor,
    getAllAppointments,
    deleteAppointment
};