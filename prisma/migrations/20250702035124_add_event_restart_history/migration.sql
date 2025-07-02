-- CreateTable
CREATE TABLE "EventRestart" (
    "id" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "restartDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventRestart_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "EventRestart" ADD CONSTRAINT "EventRestart_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;
