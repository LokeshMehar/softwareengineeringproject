/*
  Warnings:

  - Made the column `password` on table `faculty` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "faculty" ALTER COLUMN "password" SET NOT NULL,
ALTER COLUMN "password" SET DEFAULT '12345678';

-- AlterTable
ALTER TABLE "student" ALTER COLUMN "password" SET DEFAULT 'abcdefgh';
