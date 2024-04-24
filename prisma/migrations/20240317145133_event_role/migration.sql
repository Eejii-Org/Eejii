-- DropIndex
DROP INDEX "EventCollaborator_eventId_idx";

-- DropIndex
DROP INDEX "EventCollaborator_userId_idx";

-- DropIndex
DROP INDEX "EventParticipator_eventId_idx";

-- DropIndex
DROP INDEX "EventParticipator_userId_idx";

-- AlterTable
ALTER TABLE "EventParticipator" ADD COLUMN     "eventRoleId" TEXT;

-- CreateTable
CREATE TABLE "EventRole" (
    "id" TEXT NOT NULL DEFAULT gen_random_uuid(),
    "name" TEXT NOT NULL,
    "slots" INTEGER NOT NULL,
    "accepted" INTEGER NOT NULL DEFAULT 0,
    "eventId" TEXT NOT NULL,

    CONSTRAINT "EventRole_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "EventRole_eventId_idx" ON "EventRole"("eventId");

-- CreateIndex
CREATE INDEX "EventCollaborator_userId_eventId_idx" ON "EventCollaborator"("userId", "eventId");

-- CreateIndex
CREATE INDEX "EventParticipator_eventId_userId_eventRoleId_idx" ON "EventParticipator"("eventId", "userId", "eventRoleId");

-- AddForeignKey
ALTER TABLE "EventRole" ADD CONSTRAINT "EventRole_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventParticipator" ADD CONSTRAINT "EventParticipator_eventRoleId_fkey" FOREIGN KEY ("eventRoleId") REFERENCES "EventRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;
