-- DropForeignKey
ALTER TABLE "faculty" DROP CONSTRAINT "faculty_department_fkey";

-- DropForeignKey
ALTER TABLE "student" DROP CONSTRAINT "student_department_fkey";

-- DropForeignKey
ALTER TABLE "subject" DROP CONSTRAINT "subject_department_fkey";

-- DropForeignKey
ALTER TABLE "test" DROP CONSTRAINT "test_department_fkey";

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("department") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("department") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("department") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("department") ON DELETE RESTRICT ON UPDATE CASCADE;
