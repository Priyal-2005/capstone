const request = require("supertest");
const app = require("../src/server");
const { prisma, resetDb } = require("./helpers");

beforeEach(resetDb);
afterAll(async () => {
  await resetDb();
  await prisma.$disconnect();
});

const user = { name: "Test Patient", email: "new@test.com", password: "123456", phone: "9000000000" };

test("register creates a patient, rejects duplicates and missing fields", async () => {
  const res = await request(app).post("/auth/register").send(user);
  expect(res.status).toBe(201);
  expect((await prisma.user.findUnique({ where: { email: user.email } })).role).toBe("PATIENT");

  expect((await request(app).post("/auth/register").send(user)).status).toBe(400);
  expect((await request(app).post("/auth/register").send({ email: "x@test.com" })).status).toBe(400);
});

test("register refuses to create a doctor", async () => {
  const res = await request(app).post("/auth/register").send({ ...user, role: "DOCTOR" });
  expect(res.status).toBe(403);
});

test("login sets auth cookies for valid credentials and rejects bad ones", async () => {
  await request(app).post("/auth/register").send(user);

  const ok = await request(app).post("/auth/login").send({ email: user.email, password: user.password });
  expect(ok.status).toBe(200);
  expect(ok.body.role).toBe("PATIENT");
  const cookies = ok.headers["set-cookie"].join(";");
  expect(cookies).toMatch(/accessToken=/);
  expect(cookies).toMatch(/refreshToken=/);

  expect((await request(app).post("/auth/login").send({ email: user.email, password: "wrong" })).status).toBe(400);
  expect((await request(app).post("/auth/login").send({ email: "nobody@test.com", password: "x" })).status).toBe(400);
});
