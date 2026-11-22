const request = require("supertest");
const app = require("../src/server");
const { prisma, cookieFor, resetDb, createUser, createDoctor, futureSlot } = require("./helpers");

beforeEach(resetDb);
afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

test("unauthenticated requests are rejected with 401", async () => {
  expect((await request(app).get("/appointments/upcoming")).status).toBe(401);
  expect((await request(app).get("/admin/appointments")).status).toBe(401);
});

test("a patient cannot use doctor or admin routes", async () => {
  const patient = await createUser("PATIENT");
  const cookie = cookieFor(patient);

  expect((await request(app).get("/doctor/appointments/today").set("Cookie", cookie)).status).toBe(403);
  expect((await request(app).get("/doctor/appointments/upcoming").set("Cookie", cookie)).status).toBe(403);
  expect((await request(app).put("/doctor/appointments/status").set("Cookie", cookie).send({ appointmentId: 1, status: "APPROVED" })).status).toBe(403);
  expect((await request(app).get("/admin/appointments").set("Cookie", cookie)).status).toBe(403);
  expect((await request(app).get("/admin/doctors").set("Cookie", cookie)).status).toBe(403);
  expect((await request(app).delete("/admin/appointments/1").set("Cookie", cookie)).status).toBe(403);
});

test("doctors and admins cannot book as patients; doctors cannot use admin routes", async () => {
  const { user: doctorUser, doctor } = await createDoctor();
  const admin = await createUser("ADMIN");
  const body = { doctorId: doctor.id, dateTime: futureSlot() };

  expect((await request(app).post("/appointments/book").set("Cookie", cookieFor(doctorUser)).send(body)).status).toBe(403);
  expect((await request(app).post("/appointments/book").set("Cookie", cookieFor(admin)).send(body)).status).toBe(403);
  expect((await request(app).get("/admin/appointments").set("Cookie", cookieFor(doctorUser))).status).toBe(403);
});
