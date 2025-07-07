-- CreateTable
CREATE TABLE "EventSpaceNotification" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSpaceNotification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EventSpaceNotification_email_eventId_key" ON "EventSpaceNotification"("email", "eventId");

-- AddForeignKey
ALTER TABLE "EventSpaceNotification" ADD CONSTRAINT "EventSpaceNotification_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
