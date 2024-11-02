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
exports.attendance = exports.testResult = exports.updateStudent = exports.updatePassword = exports.studentLogin = void 0;
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
    newPassword: zod_1.z.string()
        .min(6, "New password must be at least 6 characters long."),
    confirmPassword: zod_1.z.string()
        .min(6, "Confirmation password must be at least 6 characters long."),
    email: zod_1.z.string()
        .email("Invalid email format.")
        .min(1, "Email is required."),
});
const updateStudentSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email format.").min(1, "Email is required."),
    name: zod_1.z.string().optional(),
    dob: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    batch: zod_1.z.string().optional(),
    section: zod_1.z.string().optional(),
    year: zod_1.z.number().optional(),
    fatherName: zod_1.z.string().optional(),
    motherName: zod_1.z.string().optional(),
    fatherContactNumber: zod_1.z.string().optional(),
});
const testResultSchema = zod_1.z.object({
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be a positive number."),
    section: zod_1.z.string().min(1, "Section is required."),
});
const attendanceSchema = zod_1.z.object({
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be a positive number."),
    section: zod_1.z.string().min(1, "Section is required."),
});
// Controller functions
const studentLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { username, password } = result.data;
    try {
        const existingStudent = yield prisma.student.findUnique({
            where: { username: username },
        });
        if (!existingStudent) {
            return res.status(404).json({ error: "Student doesn't exist." });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingStudent.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ email: existingStudent.email, id: existingStudent.id }, process.env.JWT_SECRET_KEY || "sEcReT", { expiresIn: "1h" });
        res.status(200).json({ result: existingStudent, token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.studentLogin = studentLogin;
const updatePassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = updatePasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { newPassword, email } = result.data;
    try {
        const student = yield prisma.student.findUnique({
            where: { email },
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        yield prisma.student.update({
            where: { email },
            data: {
                password: hashedPassword,
                passwordUpdated: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password updated successfully.",
            response: student,
        });
    }
    catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.updatePassword = updatePassword;
const updateStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = updateStudentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { email } = result.data;
    try {
        const updatedStudent = yield prisma.student.update({
            where: { email },
            data: req.body,
        });
        res.status(200).json(updatedStudent);
    }
    catch (error) {
        console.error("Update student error:", error);
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: "Student not found." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.updateStudent = updateStudent;
const testResult = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = testResultSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { department, year, section } = result.data;
    try {
        const student = yield prisma.student.findFirst({
            where: { department, year, section },
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }
        const tests = yield prisma.test.findMany({
            where: { department, year: year.toString(), section },
        });
        if (tests.length === 0) {
            return res.status(404).json({ error: "No tests found." });
        }
        const results = yield Promise.all(tests.map((test) => __awaiter(void 0, void 0, void 0, function* () {
            const marks = yield prisma.marks.findFirst({
                where: { studentId: student.id, examId: test.id },
            });
            return marks
                ? {
                    marks: marks.marks,
                    totalMarks: test.totalMarks,
                    subjectCode: test.subjectCode,
                    testName: test.test,
                }
                : null;
        })));
        res.status(200).json({ results });
    }
    catch (error) {
        console.error("Test result retrieval error:", error);
        if (error instanceof Error && error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: "Test not found." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.testResult = testResult;
const attendance = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = attendanceSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { department, year, section } = result.data;
    try {
        const student = yield prisma.student.findFirst({
            where: { department, year, section },
        });
        if (!student) {
            return res.status(404).json({ error: "Student not found." });
        }
        const attendances = yield prisma.attendance.findMany({
            where: { studentId: student.id },
            include: { subject: true },
        });
        if (!attendances.length) {
            return res.status(404).json({ message: "Attendance not found." });
        }
        const attendanceResults = attendances.map((att) => ({
            percentage: ((att.lectureAttended / att.totalLecturesByFaculty) * 100).toFixed(2),
            subjectCode: att.subject.subjectCode,
            subjectName: att.subject.subjectName,
            attendedLectures: att.lectureAttended,
            totalLecturesByFaculty: att.totalLecturesByFaculty,
        }));
        res.status(200).json({ results: attendanceResults });
    }
    catch (error) {
        console.error("Attendance retrieval error:", error);
        if (error.code === 'P2025') { // Record not found
            return res.status(404).json({ error: "Attendance not found." });
        }
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.attendance = attendance;
