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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllSubject = exports.getAllDepartment = exports.getAllAdmin = exports.getAllFaculty = exports.getAllStudent = exports.getStudent = exports.addStudent = exports.deleteDepartment = exports.deleteSubject = exports.deleteStudent = exports.deleteFaculty = exports.deleteAdmin = exports.getAdmin = exports.getSubject = exports.addSubject = exports.getNotice = exports.getFaculty = exports.addFaculty = exports.addDepartment = exports.createNotice = exports.addDummyAdmin = exports.addAdmin = exports.updateAdmin = exports.updatedPassword = exports.adminLogin = void 0;
const client_1 = require("@prisma/client");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const prisma = new client_1.PrismaClient();
// Validation schemas
const loginSchema = zod_1.z.object({
    username: zod_1.z.string().min(1, "Username is required."),
    password: zod_1.z.string().min(1, "Password is required."),
});
const updatePasswordSchema = zod_1.z.object({
    newPassword: zod_1.z.string().min(6, "New password must be at least 6 characters long."),
    confirmPassword: zod_1.z.string().min(6, "Confirmation password must be at least 6 characters long."),
    email: zod_1.z.string().email("Invalid email format."),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation password must match.",
    path: ["confirmPassword"], // path of error
});
const updateAdminSchema = zod_1.z.object({
    name: zod_1.z.string().optional(),
    dob: zod_1.z.string().optional(),
    department: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    email: zod_1.z.string().email("Invalid email format."),
});
const addAdminSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    email: zod_1.z.string().email("Invalid email format."),
    department: zod_1.z.string().optional(),
    dob: zod_1.z.string().optional(),
    joiningYear: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
const addDepartmentSchema = zod_1.z.object({
    department: zod_1.z.string().min(1, "Department name is required."),
});
const addFacultySchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    email: zod_1.z.string().email("Invalid email format."),
    department: zod_1.z.string().min(1, "Department is required."),
    designation: zod_1.z.string().min(1, "Designation is required."),
    dob: zod_1.z.string().min(1, "Date of birth is required."),
    joiningYear: zod_1.z.number().min(1900, "Invalid joining year."),
    gender: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
});
const addSubjectSchema = zod_1.z.object({
    subjectName: zod_1.z.string().min(1, "Subject name is required."),
    subjectCode: zod_1.z.string().min(1, "Subject code is required."),
    department: zod_1.z.string().min(1, "Department is required."),
    totalLectures: zod_1.z.number().min(0, "Total lectures must be non-negative."),
    year: zod_1.z.string().min(1, "Year is required."),
});
const addStudentSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Name is required."),
    email: zod_1.z.string().email("Invalid email format."),
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be positive."),
    section: zod_1.z.string().min(1, "Section is required."),
    dob: zod_1.z.string().min(1, "Date of birth is required."),
    gender: zod_1.z.string().optional(),
    contactNumber: zod_1.z.string().optional(),
    avatar: zod_1.z.string().optional(),
    fatherName: zod_1.z.string().optional(),
    motherName: zod_1.z.string().optional(),
    fatherContactNumber: zod_1.z.string().optional(),
    motherContactNumber: zod_1.z.string().optional(),
    batch: zod_1.z.string().optional(),
});
const getStudentSchema = zod_1.z.object({
    department: zod_1.z.string().min(1, "Department is required."),
    year: zod_1.z.number().min(1, "Year must be positive."),
    section: zod_1.z.string().optional(),
});
// Controller functions
const adminLogin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa admin login me");
    const result = loginSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { username, password } = result.data;
    try {
        const existingAdmin = yield prisma.admin.findUnique({
            where: { username },
        });
        if (!existingAdmin) {
            return res.status(404).json({ error: "Admin doesn't exist." });
        }
        if (!existingAdmin.password) {
            return res.status(401).json({ error: "Password not set." });
        }
        const isPasswordCorrect = yield bcrypt_1.default.compare(password, existingAdmin.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: "Invalid credentials." });
        }
        const token = jsonwebtoken_1.default.sign({ email: existingAdmin.email, id: existingAdmin.id }, process.env.JWT_SECRET_KEY || "sEcReT", { expiresIn: "1h" });
        res.status(200).json({ result: existingAdmin, token });
    }
    catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.adminLogin = adminLogin;
const updatedPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa admin password me");
    const result = updatePasswordSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { newPassword, confirmPassword, email } = result.data;
    if (newPassword !== confirmPassword) {
        return res.status(400).json({
            error: "Password and confirmation password do not match."
        });
    }
    try {
        const hashedPassword = yield bcrypt_1.default.hash(newPassword, 10);
        const updatedAdmin = yield prisma.admin.update({
            where: { email },
            data: {
                password: hashedPassword,
                passwordUpdated: true,
            },
        });
        res.status(200).json({
            success: true,
            message: "Password updated successfully",
            response: updatedAdmin,
        });
    }
    catch (error) {
        console.error("Update password error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.updatedPassword = updatedPassword;
const updateAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa admin update me");
    const result = updateAdminSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const _a = result.data, { email } = _a, updateData = __rest(_a, ["email"]);
    try {
        const updatedAdmin = yield prisma.admin.update({
            where: { email },
            data: updateData,
        });
        res.status(200).json(updatedAdmin);
    }
    catch (error) {
        console.error("Update admin error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.updateAdmin = updateAdmin;
const addAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa admin add me");
    const result = addAdminSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const { name, email, department, dob, joiningYear, contactNumber, avatar } = result.data;
    try {
        const existingAdmin = yield prisma.admin.findUnique({
            where: { email },
        });
        if (existingAdmin) {
            return res.status(400).json({ error: "Email already exists" });
        }
        // Generate username
        const departmentData = yield prisma.department.findUnique({
            where: { department: department || "" },
        });
        if (!departmentData && department) {
            return res.status(400).json({ error: "Department not found" });
        }
        const adminCount = yield prisma.admin.count({
            where: { department },
        });
        const date = new Date();
        const helper = adminCount.toString().padStart(3, '0');
        const username = `ADM${date.getFullYear()}${(departmentData === null || departmentData === void 0 ? void 0 : departmentData.departmentCode) || ''}${helper}`;
        // Hash password (using DOB as initial password)
        const hashedPassword = yield bcrypt_1.default.hash((dob === null || dob === void 0 ? void 0 : dob.split("-").reverse().join("-")) || "default", 10);
        const newAdmin = yield prisma.admin.create({
            data: {
                name,
                email,
                username,
                password: hashedPassword,
                department,
                dob,
                joiningYear,
                contactNumber,
                avatar,
                passwordUpdated: false,
            },
        });
        res.status(201).json({
            success: true,
            message: "Admin registered successfully",
            response: newAdmin,
        });
    }
    catch (error) {
        console.error("Add admin error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.addAdmin = addAdmin;
const addDummyAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const existingAdmin = yield prisma.admin.findUnique({
            where: { email: "dummy@gmail.com" },
        });
        if (!existingAdmin) {
            const hashedPassword = yield bcrypt_1.default.hash("123", 10);
            yield prisma.admin.create({
                data: {
                    name: "dummy",
                    email: "dummy@gmail.com",
                    username: "ADMDUMMY",
                    password: hashedPassword,
                    passwordUpdated: true,
                },
            });
            console.log("Dummy admin added.");
        }
        else {
            console.log("Dummy admin already exists.");
        }
    }
    catch (error) {
        console.error("Add dummy admin error:", error);
    }
});
exports.addDummyAdmin = addDummyAdmin;
const createNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const noticeSchema = zod_1.z.object({
        from: zod_1.z.string().min(1, "From field is required."),
        content: zod_1.z.string().min(1, "Content is required."),
        topic: zod_1.z.string().min(1, "Topic is required."),
        date: zod_1.z.string().min(1, "Date is required."),
        noticeFor: zod_1.z.string().min(1, "Notice recipient is required."),
    });
    const result = noticeSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const existingNotice = yield prisma.notice.findFirst({
            where: {
                AND: [
                    { topic: result.data.topic },
                    { content: result.data.content },
                    { date: result.data.date },
                ],
            },
        });
        if (existingNotice) {
            return res.status(400).json({ error: "Notice already exists" });
        }
        const newNotice = yield prisma.notice.create({
            data: result.data,
        });
        res.status(201).json({
            success: true,
            message: "Notice created successfully",
            response: newNotice,
        });
    }
    catch (error) {
        console.error("Create notice error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.createNotice = createNotice;
const addDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa add department me");
    const result = addDepartmentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const { department } = result.data;
        const existingDepartment = yield prisma.department.findUnique({
            where: { department },
        });
        if (existingDepartment) {
            return res.status(400).json({ error: "Department already exists" });
        }
        const departmentCount = yield prisma.department.count();
        const departmentCode = (departmentCount + 1).toString().padStart(2, '0');
        const newDepartment = yield prisma.department.create({
            data: {
                department,
                departmentCode,
            },
        });
        res.status(201).json({
            success: true,
            message: "Department added successfully",
            response: newDepartment,
        });
    }
    catch (error) {
        console.error("Add department error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.addDepartment = addDepartment;
const addFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa add faculty  me");
    const result = addFacultySchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    const facultyData = result.data;
    try {
        const existingFaculty = yield prisma.faculty.findUnique({
            where: { email: facultyData.email },
        });
        if (existingFaculty) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const departmentData = yield prisma.department.findFirst({
            where: { department: facultyData.department },
        });
        if (!departmentData) {
            return res.status(400).json({ error: "Department not found" });
        }
        const facultyCount = yield prisma.faculty.count({
            where: { department: facultyData.department },
        });
        const date = new Date();
        const helper = facultyCount.toString().padStart(3, '0');
        const username = `FAC${date.getFullYear()}${departmentData.departmentCode}${helper}`;
        const hashedPassword = yield bcrypt_1.default.hash(facultyData.dob.split("-").reverse().join("-"), 10);
        const newFaculty = yield prisma.faculty.create({
            data: Object.assign(Object.assign({}, facultyData), { username, password: hashedPassword, passwordUpdated: false }),
        });
        res.status(201).json({
            success: true,
            message: "Faculty registered successfully",
            response: newFaculty,
        });
    }
    catch (error) {
        console.error("Add faculty error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.addFaculty = addFaculty;
const getFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa faculty get me");
    const { department } = req.body;
    try {
        const dept = yield prisma.department.findUnique({
            where: { department },
        });
        if (!dept) {
            return res.status(404).json({ error: "No Department found of this name" });
        }
        const faculties = yield prisma.faculty.findMany({
            where: { department },
        });
        if (faculties.length === 0) {
            return res.status(404).json({ error: "No faculty found" });
        }
        res.status(200).json({ result: faculties });
    }
    catch (error) {
        console.error("Get faculty error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getFaculty = getFaculty;
const getNotice = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa notice get me");
    try {
        const notices = yield prisma.notice.findMany();
        if (notices.length === 0) {
            return res.status(404).json({ error: "No notices found" });
        }
        res.status(200).json({ result: notices });
    }
    catch (error) {
        console.error("Get notice error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getNotice = getNotice;
const addSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa add subject me");
    const result = addSubjectSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const _a = result.data, { subjectCode } = _a, subjectData = __rest(_a, ["subjectCode"]);
        const existingSubject = yield prisma.subject.findFirst({
            where: { subjectCode },
        });
        if (existingSubject) {
            return res.status(400).json({ error: "Subject already exists" });
        }
        const newSubject = yield prisma.subject.create({
            data: Object.assign({ subjectCode }, subjectData),
        });
        // Update students with the new subject
        const students = yield prisma.student.findMany({
            where: {
                department: subjectData.department,
                year: parseInt(subjectData.year, 10),
            },
        });
        3;
        for (const student of students) {
            yield prisma.student.update({
                where: { id: student.id },
                data: {
                    subjects: {
                        connect: { id: newSubject.id },
                    },
                },
            });
        }
        res.status(201).json({
            success: true,
            message: "Subject added successfully",
            response: newSubject,
        });
    }
    catch (error) {
        console.error("Add subject error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.addSubject = addSubject;
const getSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa get subject me");
    if (!req.userId) {
        return res.status(401).json({ error: "Unauthenticated" });
    }
    try {
        const { department, year } = req.body;
        const subjects = yield prisma.subject.findMany({
            where: { department, year },
        });
        if (subjects.length === 0) {
            return res.status(404).json({ error: "No subjects found" });
        }
        res.status(200).json({ result: subjects });
    }
    catch (error) {
        console.error("Get subject error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getSubject = getSubject;
const getAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { department } = req.body;
        const admins = yield prisma.admin.findMany({
            where: { department },
        });
        if (admins.length === 0) {
            return res.status(404).json({ error: "No admins found" });
        }
        res.status(200).json({ result: admins });
    }
    catch (error) {
        console.error("Get admin error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getAdmin = getAdmin;
const deleteAdmin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aayaa delete admin me");
    try {
        const adminIds = req.body;
        console.log(req.body);
        console.log("adminIds", adminIds);
        const delitem = yield prisma.admin.deleteMany({
            where: {
                id: { in: adminIds },
            },
        });
        console.log("delitem", delitem);
        res.status(200).json({ message: "Admins deleted successfully" });
    }
    catch (error) {
        console.error("Delete admin error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.deleteAdmin = deleteAdmin;
const deleteFaculty = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya delete faculty me");
    try {
        const facultyIds = req.body;
        yield prisma.faculty.deleteMany({
            where: {
                id: { in: facultyIds },
            },
        });
        res.status(200).json({ message: "Faculty members deleted successfully" });
    }
    catch (error) {
        console.error("Delete faculty error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.deleteFaculty = deleteFaculty;
const deleteStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya del student me");
    try {
        const studentIds = req.body;
        yield prisma.student.deleteMany({
            where: {
                id: { in: studentIds },
            },
        });
        res.status(200).json({ message: "Students deleted successfully" });
    }
    catch (error) {
        console.error("Delete student error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.deleteStudent = deleteStudent;
const deleteSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya delete subject");
    try {
        const subjectIds = req.body;
        yield prisma.subject.deleteMany({
            where: {
                id: { in: subjectIds },
            },
        });
        res.status(200).json({ message: "Subjects deleted successfully" });
    }
    catch (error) {
        console.error("Delete subject error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.deleteSubject = deleteSubject;
const deleteDepartment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya delete department me");
    try {
        const { department } = req.body;
        yield prisma.department.delete({
            where: { department },
        });
        res.status(200).json({ message: "Department deleted successfully" });
    }
    catch (error) {
        console.error("Delete department error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.deleteDepartment = deleteDepartment;
const addStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya add student me");
    const result = addStudentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const _a = result.data, { email, department, dob } = _a, studentData = __rest(_a, ["email", "department", "dob"]);
        const existingStudent = yield prisma.student.findUnique({
            where: { email },
        });
        if (existingStudent) {
            return res.status(400).json({ error: "Email already exists" });
        }
        const departmentData = yield prisma.department.findUnique({
            where: { department },
        });
        if (!departmentData) {
            return res.status(400).json({ error: "Department not found" });
        }
        const studentCount = yield prisma.student.count({
            where: { department },
        });
        const date = new Date();
        const helper = studentCount.toString().padStart(3, '0');
        const username = `STU${date.getFullYear()}${departmentData.departmentCode}${helper}`;
        const hashedPassword = yield bcrypt_1.default.hash(dob.split("-").reverse().join("-"), 10);
        const newStudent = yield prisma.student.create({
            data: Object.assign(Object.assign({ email,
                department,
                dob }, studentData), { username, password: hashedPassword, passwordUpdated: false }),
        });
        // Add existing subjects for the student's year and department
        const subjects = yield prisma.subject.findMany({
            where: {
                department,
                year: studentData.year.toString(),
            },
        });
        if (subjects.length > 0) {
            yield prisma.student.update({
                where: { id: newStudent.id },
                data: {
                    subjects: {
                        connect: subjects.map(subject => ({ id: subject.id })),
                    },
                },
            });
        }
        res.status(201).json({
            success: true,
            message: "Student registered successfully",
            response: newStudent,
        });
    }
    catch (error) {
        console.error("Add student error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.addStudent = addStudent;
const getStudent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya get student me");
    const result = getStudentSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({ errors: result.error.flatten() });
    }
    try {
        const { department, year, section } = result.data;
        const students = yield prisma.student.findMany({
            where: Object.assign({ department,
                year }, (section && { section })),
        });
        if (students.length === 0) {
            return res.status(404).json({ error: "No students found" });
        }
        res.status(200).json({ result: students });
    }
    catch (error) {
        console.error("Get student error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getStudent = getStudent;
const getAllStudent = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya get all student me");
    try {
        const students = yield prisma.student.findMany();
        res.status(200).json(students);
    }
    catch (error) {
        console.error("Get all students error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getAllStudent = getAllStudent;
const getAllFaculty = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya get all faculty me");
    try {
        const faculty = yield prisma.faculty.findMany();
        res.status(200).json(faculty);
    }
    catch (error) {
        console.error("Get all faculty error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getAllFaculty = getAllFaculty;
const getAllAdmin = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya get all admin me");
    try {
        const admins = yield prisma.admin.findMany();
        res.status(200).json(admins);
    }
    catch (error) {
        console.error("Get all admins error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getAllAdmin = getAllAdmin;
const getAllDepartment = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya get all department me");
    try {
        const departments = yield prisma.department.findMany();
        res.status(200).json(departments);
    }
    catch (error) {
        console.error("Get all departments error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getAllDepartment = getAllDepartment;
const getAllSubject = (_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("aaya get all subject");
    try {
        const subjects = yield prisma.subject.findMany();
        res.status(200).json(subjects);
    }
    catch (error) {
        console.error("Get all subjects error:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});
exports.getAllSubject = getAllSubject;
