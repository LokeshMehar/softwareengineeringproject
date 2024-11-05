-- CreateIndex
CREATE INDEX "attendance_studentId_subjectId_idx" ON "attendance"("studentId", "subjectId");

-- CreateIndex
CREATE INDEX "faculty_department_idx" ON "faculty"("department");

-- CreateIndex
CREATE INDEX "marks_examId_studentId_idx" ON "marks"("examId", "studentId");

-- CreateIndex
CREATE INDEX "student_department_section_year_idx" ON "student"("department", "section", "year");

-- CreateIndex
CREATE INDEX "subject_department_year_idx" ON "subject"("department", "year");

-- CreateIndex
CREATE INDEX "test_subjectCode_department_year_section_idx" ON "test"("subjectCode", "department", "year", "section");
