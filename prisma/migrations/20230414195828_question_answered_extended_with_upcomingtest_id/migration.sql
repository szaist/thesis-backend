/*
  Warnings:

  - Added the required column `upcomingTestId` to the `QuestionAnswered` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "QuestionAnswered" ADD COLUMN     "upcomingTestId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "QuestionAnswered" ADD CONSTRAINT "QuestionAnswered_upcomingTestId_fkey" FOREIGN KEY ("upcomingTestId") REFERENCES "upcomingtests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
