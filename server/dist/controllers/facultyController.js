"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteStudyMaterial = exports.getStudyMaterials = exports.addStudyMaterial = exports.markAttendance = exports.uploadMarks = exports.getStudent = exports.getTest = exports.createTest = exports.updateFaculty = exports.updatedPassword = exports.facultyLogin = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas using Zod
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required."),
    password: zod_1.z.string().min(1, "Password is required."),
});
const updatePasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters long."),
    confirmPassword: zod_1.z.string().min(6, "Confirmation password must be at least 6 characters long."),
    email: zod_1.z.string().email("Invalid email format.").min(1, "Email is required."),
});
const updateFacultySchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format.").min(1, "Email is required."),
    name: zod_1.z.string().optional(),
    dob: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    designation: zod_1.z.string().optional(),
});
const createTestSchema = zod_1.z.object({
    subjectCode: zod_1.z.string().min(1, "Subject code is required."),
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.string().min(1, "Year is required."),
    section: zod_1.z.string().min(1, "Section is required."),
    date: zod_1.z.string().min(1, "Date is required."),
    test: zod_1.z.string().min(1, "Test name is required."),
    totalMarks: zod_1.z.number().min(0, "Total marks must be a non-negative number."),
});
const getStudentsSchema = zod_1.z.object({
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be a positive number."),
    section: zod_1.z.string().min(1, "Section is required."),
});
const uploadMarksSchema = zod_1.z.object({
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be a positive number."),
    section: zod_1.z.string().min(1, "Section is required."),
    test: zod_1.z.string().min(1, "Test name is required."),
    marks: zod_1.z.array(zod_1.z.object({
        _id: zod_1.z.string(),
        value: zod_1.z.number(),
    })),
});
const markAttendanceSchema = zod_1.z.object({
    selectedStudents: zod_1.z.array(zod_1.z.string()).min(1, "At least one student must be selected."),
    subjectName: zod_1.z.string().min(1, "Subject name is required."),
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be a positive number."),
    section: zod_1.z.string().min(1, "Section is required."),
});
const studyMaterialSchema = zod_1.z.object({
    title: zod_1.z.string().min(1, 'Title is required'),
    description: zod_1.z.string().min(1, 'Description is required'),
    fileUrl: zod_1.z.string().url('File URL must be a valid URL'),
    subject: zod_1.z.string().min(1, 'Subject is required'),
    year: zod_1.z.number().positive('Year must be a positive number'),
    department: zod_1.z.string().min(1, 'Department is required'),
    section: zod_1.z.string().min(1, 'Section is required')
});
const getStudyMaterialSchema = zod_1.z.object({
    department: zod_1.z.string(),
    year: zod_1.z.string(),
    section: zod_1.z.string(),
    subjectCode: zod_1.z.string()
});
// Controller functions
const facultyLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { username, password } = result.data;
    try {
        const existingFaculty = yield prisma.faculty.findUnique({
            where: { username: username },
        });
        if (!existingFaculty) {
            return res.status(404).json({ error: "Faculty doesn't exist." });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingFaculty.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ email: existingFaculty.email, id: existingFaculty.id }, process.env.JWT_SECRET_KEY || "sEcReT", { expiresIn: "1h" });
        res.status(200).json({ result: existingFaculty, token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.facultyLogin = facultyLogin;
const updatedPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = updatePasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { newPassword, email } = result.data;
    try {
        const faculty = yield prisma.faculty.findUnique({
            where: { email },
        });
        if (!faculty) {
            return res.status(404).json({ error: "Faculty not found." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield prisma.faculty.update({
            where: { email },
            data: {
                password: hashedPassword,
                passwordUpdated: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password updated successfully.",
            response: faculty,
        });
    }
    catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.updatedPassword = updatedPassword;
const updateFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = updateFacultySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { email } = result.data;
    try {
        const updatedFaculty = yield prisma.faculty.update({
            where: { email },
            data: req.body,
        });
        res.status(200).json(updatedFaculty);
    }
    catch (error) {
        console.error("Update faculty error:", error);
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: "Faculty not found." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.updateFaculty = updateFaculty;
const createTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = createTestSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { subjectCode, department, year, section, date, test, totalMarks } = result.data;
    try {
        const existingTest = yield prisma.test.findFirst({
            where: {
                subjectCode,
                department,
                year: year,
                section,
                test,
            },
        });
        if (existingTest) {
            return res.status(400).json({ error: "Given Test is already created" });
        }
        const newTest = yield prisma.test.create({
            data: {
                totalMarks,
                section,
                test,
                date,
                department,
                subjectCode,
                year,
            },
        });
        // Optionally handle students here if needed
        return res.status(201).json({
            success: true,
            message: "Test added successfully",
            response: newTest,
        });
    }
    catch (error) {
        console.error("Create test error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.createTest = createTest;
const getTest = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { department, year, section } = req.body;
        const tests = yield prisma.test.findMany({
            where: {
                department,
                year,
                section,
            },
        });
        res.status(200).json({ result: tests });
    }
    catch (error) {
        console.error("Get tests error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getTest = getTest;
const getStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = getStudentsSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { department, year, section } = result.data;
    try {
        const students = yield prisma.student.findMany({
            where: {
                department,
                year,
                section,
            },
        });
        if (students.length === 0) {
            return res.status(404).json({ error: "No Student Found" });
        }
        res.status(200).json({ result: students });
    }
    catch (error) {
        console.error("Get students error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getStudent = getStudent;
const uploadMarks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = uploadMarksSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { department, year, section, test, marks } = result.data;
    try {
        const existingTest = yield prisma.test.findFirst({
            where: {
                department,
                year: year.toString(),
                section,
                test
            },
        });
        if (!existingTest) {
            return res.status(404).json({ error: "Test not found." });
        }
        // Check for already uploaded marks
        const existingMarks = yield prisma.marks.findMany({
            where: {
                examId: existingTest.id
            },
        });
        if (existingMarks.length !== 0) {
            return res.status(400).json({ error: "You have already uploaded marks for the given exam" });
        }
        for (const mark of marks) {
            yield prisma.marks.create({
                data: {
                    studentId: mark._id,
                    examId: existingTest.id,
                    marks: mark.value
                },
            });
        }
        res.status(200).json({ message: "Marks uploaded successfully" });
    }
    catch (error) {
        console.error("Upload marks error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.uploadMarks = uploadMarks;
const markAttendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = markAttendanceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { selectedStudents, subjectName, department, year, section } = result.data;
    try {
        // Find the subject
        const subject = yield prisma.subject.findUnique({
            where: { subjectName },
        });
        if (!subject) {
            return res.status(404).json({ error: "Subject not found." });
        }
        // Find all students in the given class
        const allStudents = yield prisma.student.findMany({
            where: {
                department,
                year,
                section,
            },
        });
        for (const student of allStudents) {
            let attendanceRecord = yield prisma.attendance.findFirst({
                where: {
                    studentId: student.id,
                    subjectId: subject.id,
                },
            });
            // If attendance record does not exist for this student and subject
            if (!attendanceRecord) {
                attendanceRecord = yield prisma.attendance.create({
                    data: {
                        studentId: student.id,
                        subjectId: subject.id,
                        totalLecturesByFaculty: 1,
                        lectureAttended: 0,
                    },
                });
            }
            else {
                attendanceRecord.totalLecturesByFaculty += 1;
                yield prisma.attendance.update({
                    where: {
                        id: attendanceRecord.id,
                    },
                    data: {
                        totalLecturesByFaculty: attendanceRecord.totalLecturesByFaculty,
                    },
                });
            }
        }
        for (const studentId of selectedStudents) {
            let attendanceRecord = yield prisma.attendance.findFirst({
                where: {
                    studentId: studentId,
                    subjectId: subject.id,
                },
            });
            // If attendance record does not exist for this selected student and subject
            if (!attendanceRecord) {
                attendanceRecord = yield prisma.attendance.create({
                    data: {
                        studentId,
                        subjectId: subject.id,
                        totalLecturesByFaculty: 0,
                        lectureAttended: 1,
                    },
                });
            }
            else {
                attendanceRecord.lectureAttended += 1;
                yield prisma.attendance.update({
                    where: {
                        id: attendanceRecord.id,
                    },
                    data: {
                        lectureAttended: attendanceRecord.lectureAttended,
                    },
                });
            }
        }
        res.status(200).json({ message: "Attendance marked successfully" });
    }
    catch (error) {
        console.error("Mark attendance error:", error);
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: "Attendance record not found." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.markAttendance = markAttendance;
const addStudyMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = studyMaterialSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const existingMaterial = yield prisma.studyMaterial.findFirst({
            where: {
                title: result.data.title,
                subjectCode: result.data.subject,
                year: result.data.year.toString(),
                department: result.data.department,
                section: result.data.section
            }
        });
        if (existingMaterial) {
            return res.status(400).json({ error: 'Study material already exists' });
        }
        const newMaterial = yield prisma.studyMaterial.create({
            data: {
                title: result.data.title,
                subjectCode: result.data.subject,
                year: result.data.year.toString(),
                department: result.data.department,
                section: result.data.section,
                material: result.data.fileUrl,
                date: Date.now().toLocaleString()
            }
        });
        res.status(201).json({
            success: true,
            message: 'Study material added successfully',
            response: newMaterial
        });
    }
    catch (error) {
        console.error('Add study material error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.addStudyMaterial = addStudyMaterial;
const getStudyMaterials = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // Validate request body
    const result = getStudyMaterialSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const { department, year, section, subjectCode } = result.data;
        const materials = yield prisma.studyMaterial.findMany({
            where: {
                department,
                year,
                section,
                subjectCode
            },
            select: {
                id: true,
                material: true,
                subjectCode: true,
                department: true,
                year: true,
                section: true,
                date: true,
                createdAt: true,
                studentId: true,
                facultyId: true
            }
        });
        if (materials.length === 0) {
            return res.status(404).json({ error: "No study materials found for the given criteria" });
        }
        res.status(200).json({ result: materials });
    }
    catch (error) {
        console.error('Get study materials error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.getStudyMaterials = getStudyMaterials;
const deleteStudyMaterial = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const studyMaterial = yield prisma.studyMaterial.findUnique({
            where: {
                id
            }
        });
        if (!studyMaterial) {
            return res.status(404).json({ error: 'Study material not found' });
        }
        yield prisma.studyMaterial.delete({
            where: {
                id
            }
        });
        res.status(200).json({
            success: true,
            message: 'Study material deleted successfully'
        });
    }
    catch (error) {
        console.error('Delete study material error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});
exports.deleteStudyMaterial = deleteStudyMaterial;
