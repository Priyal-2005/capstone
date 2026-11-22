const request = require("supertest");
const app = require("../src/server");
const { prisma, cookieFor, resetDb, createUser, createDoctor, futureSlot } = require("./helpers");

beforeEach(resetDb);
afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

const book = (patient, doctorId, dateTime) =>
  request(app).post("/appointments/book").set("Cookie", cookieFor(patient)).send({ doctorId, dateTime });

const setStatus = (doctorUser, appointmentId, status) =>
  request(app).put("/doctor/appointments/status").set("Cookie", cookieFor(doctorUser)).send({ appointmentId, status });

test("booking returns the existing response shape", async () => {
  const patient = await createUser("PATIENT");
  const { doctor } = await createDoctor();

  const res = await book(patient, doctor.id, futureSlot());
  expect(res.status).toBe(201);
  expect(res.body.message).toBe("Appointment booked successfully");
  expect(res.body.data).toMatchObject({ status: "PENDING", doctorId: doctor.id, patientId: patient.id });
  expect(res.body.data.doctor.user).toHaveProperty("name");
  expect(res.body.data.patient).toHaveProperty("email");
});

test("a second booking of a taken slot is a 409", async () => {
  const patient = await createUser("PATIENT");
  const { doctor } = await createDoctor();
  const dateTime = futureSlot();

  expect((await book(patient, doctor.id, dateTime)).status).toBe(201);
  const dup = await book(patient, doctor.id, dateTime);
  expect(dup.status).toBe(409);
  expect(dup.body.message).toBe("That slot is already booked");
});

test("a past dateTime is rejected", async () => {
  const patient = await createUser("PATIENT");
  const { doctor } = await createDoctor();
  const past = new Date(Date.now() - 24 * 3600 * 1000).toISOString();

  const res = await book(patient, doctor.id, past);
  expect(res.status).toBe(400);
  expect(res.body.message).toBe("dateTime must be in the future");
  expect(await prisma.appointment.count()).toBe(0);
});

test("declining frees the slot so it can be rebooked", async () => {
  const patient = await createUser("PATIENT");
  const other = await createUser("PATIENT", "other");
  const { user: doctorUser, doctor } = await createDoctor();
  const dateTime = futureSlot();

  const first = await book(patient, doctor.id, dateTime);
  expect(first.status).toBe(201);
  expect((await book(other, doctor.id, dateTime)).status).toBe(409);

  const declined = await setStatus(doctorUser, first.body.data.id, "DECLINED");
  expect(declined.status).toBe(200);
  expect(declined.body.data.activeSlot).toBeNull();

  const rebook = await book(other, doctor.id, dateTime);
  expect(rebook.status).toBe(201);

  // The declined appointment can't be reactivated while the slot is retaken
  expect((await setStatus(doctorUser, first.body.data.id, "APPROVED")).status).toBe(409);
});

test("approving keeps the slot held", async () => {
  const patient = await createUser("PATIENT");
  const { user: doctorUser, doctor } = await createDoctor();
  const dateTime = futureSlot();

  const first = await book(patient, doctor.id, dateTime);
  const approved = await setStatus(doctorUser, first.body.data.id, "APPROVED");
  expect(approved.body.data.activeSlot).toBe(1);
  expect((await book(patient, doctor.id, dateTime)).status).toBe(409);
});

test("an admin deleting an appointment frees the slot", async () => {
  const patient = await createUser("PATIENT");
  const admin = await createUser("ADMIN");
  const { doctor } = await createDoctor();
  const dateTime = futureSlot();

  const first = await book(patient, doctor.id, dateTime);
  const del = await request(app).delete(`/admin/appointments/${first.body.data.id}`).set("Cookie", cookieFor(admin));
  expect(del.status).toBe(200);
  expect((await book(patient, doctor.id, dateTime)).status).toBe(201);
});
