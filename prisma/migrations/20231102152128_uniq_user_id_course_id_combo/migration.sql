/*
  Warnings:

  - A unique constraint covering the columns `[userId,courseId]` on the table `CourseToUser` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "CourseToUser_userId_courseId_key" ON "CourseToUser"("userId", "courseId");
