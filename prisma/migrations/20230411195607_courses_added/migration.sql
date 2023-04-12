/*
  Warnings:

  - You are about to drop the `UsersToUpComingTests` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `courseId` to the `upcomingtests` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionAnswered" DROP CONSTRAINT "QuestionAnswered_answerId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionAnswered" DROP CONSTRAINT "QuestionAnswered_questionId_fkey";

-- DropForeignKey
ALTER TABLE "TestFilled" DROP CONSTRAINT "TestFilled_upComingTestId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToUpComingTests" DROP CONSTRAINT "UsersToUpComingTests_upComingTestId_fkey";

-- DropForeignKey
ALTER TABLE "UsersToUpComingTests" DROP CONSTRAINT "UsersToUpComingTests_userId_fkey";

-- DropForeignKey
ALTER TABLE "answers" DROP CONSTRAINT "answers_questionId_fkey";

-- DropForeignKey
ALTER TABLE "questions" DROP CONSTRAINT "questions_testId_fkey";

-- DropForeignKey
ALTER TABLE "upcomingtests" DROP CONSTRAINT "upcomingtests_testId_fkey";

-- AlterTable
ALTER TABLE "upcomingtests" ADD COLUMN     "courseId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "UsersToUpComingTests";

-- CreateTable
CREATE TABLE "courses" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseToUser" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "courseId" INTEGER NOT NULL,

    CONSTRAINT "CourseToUser_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestFilled" ADD CONSTRAINT "TestFilled_upComingTestId_fkey" FOREIGN KEY ("upComingTestId") REFERENCES "upcomingtests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswered" ADD CONSTRAINT "QuestionAnswered_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswered" ADD CONSTRAINT "QuestionAnswered_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upcomingtests" ADD CONSTRAINT "upcomingtests_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upcomingtests" ADD CONSTRAINT "upcomingtests_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToUser" ADD CONSTRAINT "CourseToUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToUser" ADD CONSTRAINT "CourseToUser_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE CASCADE ON UPDATE CASCADE;
