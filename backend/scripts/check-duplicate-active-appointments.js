// Run BEFORE applying the activeSlot migration. Reports slots that already have
// more than one PENDING/APPROVED appointment; the migration's unique index
// would fail on these, so resolve them first.
//   DATABASE_URL=... node scripts/check-duplicate-active-appointments.js
const prisma = require("../src/config/prisma");

async function main() {
  const dupes = await prisma.$queryRaw`
    SELECT "doctorId", "dateTime", COUNT(*)::int AS count,
           ARRAY_AGG("id" ORDER BY "id") AS ids,
           ARRAY_AGG("status"::text ORDER BY "id") AS statuses
    FROM "Appointment"
    WHERE "status" IN ('PENDING', 'APPROVED')
    GROUP BY "doctorId", "dateTime"
    HAVING COUNT(*) > 1
    ORDER BY "dateTime"`;

  if (dupes.length === 0) {
    console.log("No duplicate active appointments found. Safe to migrate.");
    return;
  }
  console.log(`Found ${dupes.length} slot(s) with duplicate active appointments:`);
  console.table(dupes.map((d) => ({ ...d, dateTime: d.dateTime.toISOString(), ids: d.ids.join(","), statuses: d.statuses.join(",") })));
  process.exitCode = 1;
}

main().finally(() => prisma.$disconnect());
