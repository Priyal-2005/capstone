const prisma = require("../config/prisma");

// patient doctor list

const getDoctorList = async (req, res) => {
    try {
        const doctors = await prisma.doctor.findMany();
        return res.status(200).json({data: doctors});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const getDoctorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        const doctor = await prisma.doctor.findUnique({
            where: {doctorId: id}
        })

        return res.status(200).json({data: doctor});
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"});
    }
}

module.exports = {
    getDoctorList,
    getDoctorById
}