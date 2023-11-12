-- DropForeignKey
ALTER TABLE "QuestionImage" DROP CONSTRAINT "QuestionImage_questionId_fkey";

-- AddForeignKey
ALTER TABLE "QuestionImage" ADD CONSTRAINT "QuestionImage_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
