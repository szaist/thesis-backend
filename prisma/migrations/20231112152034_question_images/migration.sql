-- CreateTable
CREATE TABLE "QuestionImage" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "source" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,

    CONSTRAINT "QuestionImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "QuestionImage_questionId_key" ON "QuestionImage"("questionId");

-- AddForeignKey
ALTER TABLE "QuestionImage" ADD CONSTRAINT "QuestionImage_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionImage" ADD CONSTRAINT "QuestionImage_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
