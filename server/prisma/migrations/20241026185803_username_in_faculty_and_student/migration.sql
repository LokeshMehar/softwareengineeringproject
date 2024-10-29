/*
  Warnings:

  - A unique constraint covering the columns `[username]` on the table `admin` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `faculty` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[username]` on the table `student` will be added. If there are existing duplicate values, this will fail.
  - Made the column `username` on table `admin` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "admin" ALTER COLUMN "username" SET NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "admin_username_key" ON "admin"("username");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_username_key" ON "faculty"("username");

-- CreateIndex
CREATE UNIQUE INDEX "student_username_key" ON "student"("username");
