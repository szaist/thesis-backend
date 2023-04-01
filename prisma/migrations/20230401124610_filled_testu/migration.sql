/*
  Warnings:

  - The values [RADIO] on the enum `QuestionTypes` will be removed. If these variants are still used in the database, this will fail.
  - Added the required column `point` to the `answers` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionTypes_new" AS ENUM ('CHECKBOX', 'SIMPLE_ANSWER', 'EXPLAIN_ANSWER', 'SELECT_ONE');
ALTER TABLE "questions" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "questions" ALTER COLUMN "type" TYPE "QuestionTypes_new" USING ("type"::text::"QuestionTypes_new");
ALTER TYPE "QuestionTypes" RENAME TO "QuestionTypes_old";
ALTER TYPE "QuestionTypes_new" RENAME TO "QuestionTypes";
DROP TYPE "QuestionTypes_old";
ALTER TABLE "questions" ALTER COLUMN "type" SET DEFAULT 'SELECT_ONE';
COMMIT;

-- AlterTable
ALTER TABLE "answers" ADD COLUMN     "point" DOUBLE PRECISION NOT NULL;

-- CreateTable
CREATE TABLE "TestFilled" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endDate" TIMESTAMP(3) NOT NULL,
    "submitted" BOOLEAN NOT NULL DEFAULT false,
    "userId" INTEGER NOT NULL,
    "upComingTestId" INTEGER NOT NULL,

    CONSTRAINT "TestFilled_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionAnswered" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "questionId" INTEGER NOT NULL,
    "answerId" INTEGER NOT NULL,

    CONSTRAINT "QuestionAnswered_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "upcomingtests" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "testId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "lastStartDate" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "upcomingtests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsersToUpComingTests" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "upComingTestId" INTEGER NOT NULL,

    CONSTRAINT "UsersToUpComingTests_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "TestFilled" ADD CONSTRAINT "TestFilled_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TestFilled" ADD CONSTRAINT "TestFilled_upComingTestId_fkey" FOREIGN KEY ("upComingTestId") REFERENCES "upcomingtests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswered" ADD CONSTRAINT "QuestionAnswered_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswered" ADD CONSTRAINT "QuestionAnswered_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionAnswered" ADD CONSTRAINT "QuestionAnswered_answerId_fkey" FOREIGN KEY ("answerId") REFERENCES "answers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "upcomingtests" ADD CONSTRAINT "upcomingtests_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersToUpComingTests" ADD CONSTRAINT "UsersToUpComingTests_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersToUpComingTests" ADD CONSTRAINT "UsersToUpComingTests_upComingTestId_fkey" FOREIGN KEY ("upComingTestId") REFERENCES "upcomingtests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
