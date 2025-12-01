const prisma = require("../config/prisma");

// patient doctor list

const getDoctorList = async (req, res) => {
    try {
        let {page = 1, limit = 10, search = "", specialization = "", sort = "name", order = "asc"} = req.query;

        page = parseInt(page);
        limit = parseInt(limit);

        // Order
        const sortField = sort === "name" ? "user" : sort;
        const sortSettings =
            sort === "name"
            ? { user: { name: order } }
            : { [sort]: order };
        
        // Filters
        const where = {
            AND: [
              specialization ? { specialization: { contains: specialization, mode: "insensitive" } } : {},
              search
                ? {
                    OR: [
                      { specialization: { contains: search, mode: "insensitive" } },
                      { user: { name: { contains: search, mode: "insensitive" } } },
                      { user: { email: { contains: search, mode: "insensitive" } } }
                    ]
                  }
                : {}
            ]
        }

        const doctors = await prisma.doctor.findMany({
            where,
            skip: (page - 1) * limit,
            take: limit,
            orderBy: sortSettings,
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        })

        const total = await prisma.doctor.count({ where })

        return res.status(200).json({
            page,
            limit,
            total,
            data: doctors
        })
    }
    catch (error) {
        console.log(error)
        return res.status(500).json({error: "Internal Server Error"});
    }
}

const getDoctorById = async (req, res) => {
    try {
        const id = parseInt(req.params.id)
        const doctor = await prisma.doctor.findUnique({
        where: { id },
        include: {
            user: {
            select: { id: true, name: true, email: true }
            }}
        })
        if (!doctor) {
        return res.status(404).json({message: "Doctor not found"});
        }

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