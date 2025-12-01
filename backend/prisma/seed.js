const prisma = require("../src/config/prisma");
const bcrypt = require("bcrypt");

async function main() {
  console.log("Seeding database...");

  // Clear existing data first (optional but recommended for testing)
  await prisma.appointment.deleteMany();
  await prisma.availability.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();

  // Create ADMIN
  const admin = await prisma.user.create({
    data: {
      name: "Admin User",
      email: "admin@test.com",
      password: await bcrypt.hash("123456", 10),
      role: "ADMIN"
    }
  });

  // Create PATIENTS
  const patients = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Patient One",
        email: "p1@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "PATIENT"
      }
    }),
    prisma.user.create({
      data: {
        name: "Patient Two",
        email: "p2@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "PATIENT"
      }
    }),
    prisma.user.create({
      data: {
        name: "Patient Three",
        email: "p3@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "PATIENT"
      }
    }),
    prisma.user.create({
      data: {
        name: "Patient Four",
        email: "p4@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "PATIENT"
      }
    })
  ]);

  // Create DOCTORS (User + Doctor profile)
  const doctorUsers = await prisma.$transaction([
    prisma.user.create({
      data: {
        name: "Dr John",
        email: "doctor1@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "DOCTOR"
      }
    }),
    prisma.user.create({
      data: {
        name: "Dr Sarah",
        email: "doctor2@test.com",
        password: await bcrypt.hash("123456", 10),
        role: "DOCTOR"
      }
    })
  ]);

  const doctor1 = await prisma.doctor.create({
    data: {
      userId: doctorUsers[0].id,
      specialization: "Cardiology"
    }
  });

  const doctor2 = await prisma.doctor.create({
    data: {
      userId: doctorUsers[1].id,
      specialization: "Dermatology"
    }
  });

  // Create some availability for doctors
  await prisma.$transaction([
    prisma.availability.create({
      data: {
        doctorId: doctor1.id,
        dayOfWeek: 1,
        startTime: "10:00",
        endTime: "14:00"
      }
    }),
    prisma.availability.create({
      data: {
        doctorId: doctor2.id,
        dayOfWeek: 2,
        startTime: "09:00",
        endTime: "12:00"
      }
    })
  ]);

  // Add sample appointments
  await prisma.appointment.create({
    data: {
      patientId: patients[0].id,
      doctorId: doctor1.id,
      dateTime: new Date("2025-02-01T11:00:00.000Z"),
      status: "PENDING"
    }
  });

  console.log("Seeding complete!");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => {
    await prisma.$disconnect();
  });