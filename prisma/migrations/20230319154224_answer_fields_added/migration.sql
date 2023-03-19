/*
  Warnings:

  - Added the required column `correct` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `answers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `text` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "QuestionTypes" AS ENUM ('CHECKBOX', 'RADIO', 'SIMPLE_ANSWER', 'EXPLAIN_ANSWER', 'SELECT_ONE');

-- CreateEnum
CREATE TYPE "ROLE" AS ENUM ('ADMIN', 'MODERATOR', 'TEACHER', 'STUDENT');

-- AlterTable
ALTER TABLE "answers" ADD COLUMN     "correct" BOOLEAN NOT NULL,
ADD COLUMN     "text" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "text" TEXT NOT NULL,
ADD COLUMN     "type" "QuestionTypes" NOT NULL DEFAULT 'SELECT_ONE';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "role" "ROLE" NOT NULL DEFAULT 'STUDENT';

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_testId_fkey" FOREIGN KEY ("testId") REFERENCES "tests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
