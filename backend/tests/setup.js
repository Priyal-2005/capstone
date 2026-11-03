// Tests must never touch a real database. Point Prisma at TEST_DATABASE_URL
// (set before any module requires the Prisma client; dotenv won't override it).
const url = process.env.TEST_DATABASE_URL;
if (!url) {
  throw new Error("TEST_DATABASE_URL is required to run tests");
}
const host = new URL(url).hostname;
if (!["localhost", "127.0.0.1", "::1"].includes(host)) {
  throw new Error(`Refusing to run tests against non-local host: ${host}`);
}
process.env.DATABASE_URL = url;
process.env.SECRET_KEY = process.env.SECRET_KEY || "test-secret";
