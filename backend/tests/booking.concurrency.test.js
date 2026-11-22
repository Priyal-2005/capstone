const request = require("supertest");
const app = require("../src/server");
const { prisma, cookieFor, resetDb, createUser, createDoctor, futureSlot } = require("./helpers");

const N = 20;

beforeEach(resetDb);
afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

test(`${N} simultaneous bookings of the same slot: exactly one succeeds`, async () => {
  const patient = await createUser("PATIENT");
  const { doctor } = await createDoctor();
  const dateTime = futureSlot();

  const responses = await Promise.all(
    Array.from({ length: N }, () =>
      request(app)
        .post("/appointments/book")
        .set("Cookie", cookieFor(patient))
        .send({ doctorId: doctor.id, dateTime })
    )
  );

  const codes = responses.map((r) => r.status);
  const created = codes.filter((c) => c === 201).length;
  const conflicts = codes.filter((c) => c === 409).length;
  console.log(`status codes: 201 x${created}, 409 x${conflicts}, other: ${codes.filter((c) => c !== 201 && c !== 409)}`);

  const rows = await prisma.appointment.count({ where: { doctorId: doctor.id, dateTime } });
  console.log(`appointment rows in DB for that slot: ${rows}`);

  expect(created).toBe(1);
  expect(conflicts).toBe(N - 1);
  expect(rows).toBe(1);
});
