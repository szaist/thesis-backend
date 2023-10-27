/*
  Warnings:

  - Added the required column `ownerId` to the `upcomingtests` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "upcomingtests" ADD COLUMN     "ownerId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "upcomingtests" ADD CONSTRAINT "upcomingtests_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
