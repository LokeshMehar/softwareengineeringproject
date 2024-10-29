/*
  Warnings:

  - A unique constraint covering the columns `[department]` on the table `department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "department_department_key" ON "department"("department");
