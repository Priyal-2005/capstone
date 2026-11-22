-- AlterTable
ALTER TABLE "Appointment" ADD COLUMN     "activeSlot" INTEGER;

-- Backfill: appointments that currently hold a slot get activeSlot = 1.
-- If duplicate active appointments exist, the unique index below fails;
-- run scripts/check-duplicate-active-appointments.js first and resolve them.
UPDATE "Appointment" SET "activeSlot" = 1 WHERE "status" IN ('PENDING', 'APPROVED');

-- CreateIndex
CREATE UNIQUE INDEX "Appointment_doctorId_dateTime_activeSlot_key" ON "Appointment"("doctorId", "dateTime", "activeSlot");
