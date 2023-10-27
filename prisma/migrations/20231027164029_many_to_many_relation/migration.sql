-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
