-- CreateTable
CREATE TABLE "admin" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "username" TEXT,
    "department" TEXT,
    "dob" TEXT,
    "joiningYear" TEXT,
    "avatar" TEXT,
    "contactNumber" TEXT,
    "passwordUpdated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendance" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "subjectId" TEXT NOT NULL,
    "totalLecturesByFaculty" INTEGER NOT NULL DEFAULT 0,
    "lectureAttended" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "department" (
    "id" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "departmentCode" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faculty" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "password" TEXT,
    "username" TEXT,
    "gender" TEXT,
    "designation" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "contactNumber" TEXT,
    "dob" TEXT NOT NULL,
    "joiningYear" INTEGER NOT NULL,
    "passwordUpdated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faculty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "marks" (
    "id" TEXT NOT NULL,
    "examId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "marks" INTEGER NOT NULL DEFAULT -1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "marks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notice" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "from" TEXT NOT NULL,
    "noticeFor" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "avatar" TEXT,
    "password" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "username" TEXT,
    "gender" TEXT,
    "fatherName" TEXT,
    "motherName" TEXT,
    "department" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "batch" TEXT,
    "contactNumber" TEXT,
    "fatherContactNumber" TEXT,
    "dob" TEXT NOT NULL,
    "passwordUpdated" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subject" (
    "id" TEXT NOT NULL,
    "subjectName" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "totalLectures" INTEGER NOT NULL DEFAULT 10,
    "year" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "subject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test" (
    "id" TEXT NOT NULL,
    "test" TEXT NOT NULL,
    "subjectCode" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "totalMarks" INTEGER NOT NULL DEFAULT 10,
    "year" TEXT NOT NULL,
    "section" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "test_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_StudentToSubject" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "admin_email_key" ON "admin"("email");

-- CreateIndex
CREATE UNIQUE INDEX "department_departmentCode_key" ON "department"("departmentCode");

-- CreateIndex
CREATE UNIQUE INDEX "faculty_email_key" ON "faculty"("email");

-- CreateIndex
CREATE UNIQUE INDEX "student_email_key" ON "student"("email");

-- CreateIndex
CREATE UNIQUE INDEX "subject_subjectCode_department_key" ON "subject"("subjectCode", "department");

-- CreateIndex
CREATE UNIQUE INDEX "_StudentToSubject_AB_unique" ON "_StudentToSubject"("A", "B");

-- CreateIndex
CREATE INDEX "_StudentToSubject_B_index" ON "_StudentToSubject"("B");

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendance" ADD CONSTRAINT "attendance_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subject"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faculty" ADD CONSTRAINT "faculty_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("departmentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_examId_fkey" FOREIGN KEY ("examId") REFERENCES "test"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "marks" ADD CONSTRAINT "marks_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student" ADD CONSTRAINT "student_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("departmentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "subject" ADD CONSTRAINT "subject_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("departmentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test" ADD CONSTRAINT "test_department_fkey" FOREIGN KEY ("department") REFERENCES "department"("departmentCode") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToSubject" ADD CONSTRAINT "_StudentToSubject_A_fkey" FOREIGN KEY ("A") REFERENCES "student"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_StudentToSubject" ADD CONSTRAINT "_StudentToSubject_B_fkey" FOREIGN KEY ("B") REFERENCES "subject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
