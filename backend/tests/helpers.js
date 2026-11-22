const bcrypt = require("bcrypt");
const prisma = require("../src/config/prisma");
const { generateAccessToken } = require("../src/utils/jwt");

const cookieFor = (user) =>
  `accessToken=${generateAccessToken({ id: user.id, role: user.role })}`;

async function resetDb() {
  await prisma.appointment.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.user.deleteMany();
}

async function createUser(role, name = role.toLowerCase()) {
  return prisma.user.create({
    data: {
      name,
      email: `${name}-${Math.random().toString(36).slice(2)}@test.com`,
      password: await bcrypt.hash("123456", 4),
      phone: "9000000000",
      role,
    },
  });
}

async function createDoctor() {
  const user = await createUser("DOCTOR");
  const doctor = await prisma.doctor.create({
    data: { userId: user.id, specialization: "Cardiology" },
  });
  return { user, doctor };
}

// A whole-second timestamp well in the future
const futureSlot = (days = 30) =>
  new Date(Math.floor(Date.now() / 1000) * 1000 + days * 24 * 3600 * 1000).toISOString();

module.exports = { prisma, cookieFor, resetDb, createUser, createDoctor, futureSlot };
