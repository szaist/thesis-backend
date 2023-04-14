/*
  Warnings:

  - The values [SIMPLE_ANSWER,EXPLAIN_ANSWER,CHECKBOX] on the enum `QuestionTypes` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "QuestionTypes_new" AS ENUM ('SELECT_ONE', 'SELECT_MORE');
ALTER TABLE "questions" ALTER COLUMN "type" DROP DEFAULT;
ALTER TABLE "questions" ALTER COLUMN "type" TYPE "QuestionTypes_new" USING ("type"::text::"QuestionTypes_new");
ALTER TYPE "QuestionTypes" RENAME TO "QuestionTypes_old";
ALTER TYPE "QuestionTypes_new" RENAME TO "QuestionTypes";
DROP TYPE "QuestionTypes_old";
ALTER TABLE "questions" ALTER COLUMN "type" SET DEFAULT 'SELECT_ONE';
COMMIT;
