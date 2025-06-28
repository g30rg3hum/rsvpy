/*
  Warnings:

  - You are about to drop the column `paymentStatus` on the `EventAttendee` table. All the data in the column will be lost.
  - You are about to drop the `Payment` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "PaymentTransferStatus" AS ENUM ('TRANSFERRED', 'CASH', 'PENDING');

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_eventId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_payerId_fkey";

-- DropForeignKey
ALTER TABLE "Payment" DROP CONSTRAINT "Payment_receiverId_fkey";

-- AlterTable
ALTER TABLE "EventAttendee" DROP COLUMN "paymentStatus",
ADD COLUMN     "payment" "PaymentTransferStatus" NOT NULL DEFAULT 'PENDING';

-- DropTable
DROP TABLE "Payment";

-- DropEnum
DROP TYPE "PaymentStatus";
