/*
  Warnings:

  - Made the column `username` on table `faculty` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `student` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "faculty" ALTER COLUMN "username" SET NOT NULL;

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "username" SET NOT NULL;
