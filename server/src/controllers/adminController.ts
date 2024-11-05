import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas
const loginSchema = z.object({
  username: z.string().min(1,"Username is required."),
  password: z.string().min(1,"Password is required."),
});

const updatePasswordSchema = z.object({
    newPassword: z.string().min(6, "New password must be at least 6 characters long."),
    confirmPassword: z.string().min(6, "Confirmation password must be at least 6 characters long."),
    email: z.string().email("Invalid email format."),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New password and confirmation password must match.",
    path: ["confirmPassword"], // path of error
});

const updateAdminSchema = z.object({
  name: z.string().optional(),
  dob: z.string().optional(),
  department: z.string().optional(),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
  email: z.string().email("Invalid email format."),
});

const addAdminSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  department: z.string().optional(),
  dob: z.string().optional(),
  joiningYear: z.string().optional(),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
});

const addDepartmentSchema = z.object({
  department: z.string().min(1, "Department name is required."),
});

const addFacultySchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  department: z.string().min(1, "Department is required."),
  designation: z.string().min(1, "Designation is required."),
  dob: z.string().min(1, "Date of birth is required."),
  joiningYear: z.number().min(1900, "Invalid joining year."),
  gender: z.string().optional(),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
});

const addSubjectSchema = z.object({
  subjectName: z.string().min(1, "Subject name is required."),
  subjectCode: z.string().min(1, "Subject code is required."),
  department: z.string().min(1, "Department is required."),
  totalLectures: z.number().min(0, "Total lectures must be non-negative."),
  year: z.string().min(1, "Year is required."),
});

const addStudentSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email format."),
  department: z.string().min(1, "Department is required."),
  year: z.number().min(1, "Year must be positive."),
  section: z.string().min(1, "Section is required."),
  dob: z.string().min(1, "Date of birth is required."),
  gender: z.string().optional(),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  fatherContactNumber: z.string().optional(),
  motherContactNumber: z.string().optional(),
  batch: z.string().optional(),
});

const getStudentSchema = z.object({
    department: z.string().min(1, "Department is required."),
    year: z.number().min(1, "Year must be positive."),
    section: z.string().optional(),
});

// Controller functions
export const adminLogin = async (req: Request, res: Response) => {

  console.log("aayaa admin login me")

  const result = loginSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { username, password } = result.data;

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!existingAdmin) {
      return res.status(404).json({ error: "Admin doesn't exist." });
    }

    if (!existingAdmin.password) {
      return res.status(401).json({ error: "Password not set." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingAdmin.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { email: existingAdmin.email, id: existingAdmin.id },
      process.env.JWT_SECRET_KEY || "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingAdmin, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updatedPassword = async (req: Request, res: Response) => {

  console.log("aayaa admin password me")

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
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const updatedAdmin = await prisma.admin.update({
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
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateAdmin = async (req: Request, res: Response) => {
  console.log("aayaa admin update me")

  const result = updateAdminSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { email, ...updateData } = result.data;

  try {
    const updatedAdmin = await prisma.admin.update({
      where: { email },
      data: updateData,
    });

    res.status(200).json(updatedAdmin);
  } catch (error) {
    console.error("Update admin error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const addAdmin = async (req: Request, res: Response) => {
  console.log("aayaa admin add me")

  const result = addAdminSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { name, email, department, dob, joiningYear, contactNumber, avatar } = result.data;

  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email },
    });

    if (existingAdmin) {
      return res.status(400).json({ error: "Email already exists" });
    }

    // Generate username
    const departmentData = await prisma.department.findUnique({
      where: { department: department || "" },
    });

    if (!departmentData && department) {
      return res.status(400).json({ error: "Department not found" });
    }

    const adminCount = await prisma.admin.count({
      where: { department },
    });

    const date = new Date();
    const helper = adminCount.toString().padStart(3, '0');
    const username = `ADM${date.getFullYear()}${departmentData?.departmentCode || ''}${helper}`;

    // Hash password (using DOB as initial password)
    const hashedPassword = await bcrypt.hash(dob?.split("-").reverse().join("-") || "default", 10);

    const newAdmin = await prisma.admin.create({
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
  } catch (error) {
    console.error("Add admin error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const addDummyAdmin = async () => {
  try {
    const existingAdmin = await prisma.admin.findUnique({
      where: { email: "dummy@gmail.com" },
    });

    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash("123", 10);
      await prisma.admin.create({
        data: {
          name: "dummy",
          email: "dummy@gmail.com",
          username: "ADMDUMMY",
          password: hashedPassword,
          passwordUpdated: true,
        },
      });
      console.log("Dummy admin added.");
    } else {
      console.log("Dummy admin already exists.");
    }
  } catch (error) {
    console.error("Add dummy admin error:", error);
  }
};

export const createNotice = async (req: Request, res: Response) => {
  const noticeSchema = z.object({
    from: z.string().min(1, "From field is required."),
    content: z.string().min(1, "Content is required."),
    topic: z.string().min(1, "Topic is required."),
    date: z.string().min(1, "Date is required."),
    noticeFor: z.string().min(1, "Notice recipient is required."),
  });

  const result = noticeSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  try {
    const existingNotice = await prisma.notice.findFirst({
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

    const newNotice = await prisma.notice.create({
      data: result.data,
    });

    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      response: newNotice,
    });
  } catch (error) {
    console.error("Create notice error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const addDepartment = async (req: Request, res: Response) => {
  console.log("aayaa add department me")

  const result = addDepartmentSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  try {
    const { department } = result.data;

    const existingDepartment = await prisma.department.findUnique({
      where: { department },
    });

    if (existingDepartment) {
      return res.status(400).json({ error: "Department already exists" });
    }

    const departmentCount = await prisma.department.count();
    const departmentCode = (departmentCount + 1).toString().padStart(2, '0');

    const newDepartment = await prisma.department.create({
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
  } catch (error) {
    console.error("Add department error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const addFaculty = async (req: Request, res: Response) => {
  console.log("aayaa add faculty  me")

  const result = addFacultySchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const facultyData = result.data;

  try {
    const existingFaculty = await prisma.faculty.findUnique({
      where: { email: facultyData.email },
    });

    if (existingFaculty) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const departmentData = await prisma.department.findFirst({
      where: { department: facultyData.department },
    });

    if (!departmentData) {
      return res.status(400).json({ error: "Department not found" });
    }

    const facultyCount = await prisma.faculty.count({
      where: { department: facultyData.department },
    });

    const date = new Date();
    const helper = facultyCount.toString().padStart(3, '0');
    const username = `FAC${date.getFullYear()}${departmentData.departmentCode}${helper}`;

    const hashedPassword = await bcrypt.hash(
      facultyData.dob.split("-").reverse().join("-"),
      10
    );

    const newFaculty = await prisma.faculty.create({
      data: {
        ...facultyData,
        username,
        password: hashedPassword,
        passwordUpdated: false,
      },
    });

    res.status(201).json({
      success: true,
      message: "Faculty registered successfully",
      response: newFaculty,
    });
  } catch (error) {
    console.error("Add faculty error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getFaculty = async (req: Request, res: Response) => {
  console.log("aayaa faculty get me")
  const { department } = req.body;

  try {
    const dept = await prisma.department.findUnique({
        where: { department  },
      });
  
    if (!dept) {
      return res.status(404).json({ error: "No Department found of this name" });
    }

    const faculties = await prisma.faculty.findMany({
      where: { department },
    });

    if (faculties.length === 0) {
      return res.status(404).json({ error: "No faculty found" });
    }

    res.status(200).json({ result: faculties });
  } catch (error) {
    console.error("Get faculty error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const getNotice = async (req: Request, res: Response) => {
  console.log("aayaa notice get me")

  try {
    const notices = await prisma.notice.findMany();

    if (notices.length === 0) {
      return res.status(404).json({ error: "No notices found" });
    }

    res.status(200).json({ result: notices });
  } catch (error) {
    console.error("Get notice error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};


export const addSubject = async (req: Request, res: Response) => {
  console.log("aayaa add subject me")
    const result = addSubjectSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }
  
    try {
      const { subjectCode, ...subjectData } = result.data;
      
      const existingSubject = await prisma.subject.findFirst({
        where: { subjectCode },
      });
  
      if (existingSubject) {
        return res.status(400).json({ error: "Subject already exists" });
      }
  
      const newSubject = await prisma.subject.create({
        data: { subjectCode, ...subjectData},
      });
  
      // Update students with the new subject
    const students = await prisma.student.findMany({
      where: {
        department: subjectData.department,
        year: parseInt(subjectData.year, 10),
      },
    });3

      for (const student of students) {
        await prisma.student.update({
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
    } catch (error) {
      console.error("Add subject error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
};

export const getSubject = async (req: Request, res: Response) => 
{
  console.log("aayaa get subject me")
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthenticated" });
    }
  
    try {
      const { department, year } = req.body;
  
      const subjects = await prisma.subject.findMany({
        where: { department, year },
      });
  
      if (subjects.length === 0) {
        return res.status(404).json({ error: "No subjects found" });
      }
  
      res.status(200).json({ result: subjects });
    } catch (error) {
      console.error("Get subject error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getAdmin = async (req: Request, res: Response) => {
    try {
      const { department } = req.body;
  
      const admins = await prisma.admin.findMany({
        where: { department },
      });
  
      if (admins.length === 0) {
        return res.status(404).json({ error: "No admins found" });
      }
  
      res.status(200).json({ result: admins });
    } catch (error) {
      console.error("Get admin error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
};

export const deleteAdmin = async (req: Request, res: Response) => {
  console.log("aayaa delete admin me")

    try {
      const adminIds: string[] = req.body;
      console.log(req.body);

      console.log("adminIds",adminIds)
  
      const delitem = await prisma.admin.deleteMany({
        where: {
          id: { in: adminIds },
        },
      });
  
      console.log("delitem",delitem)
      res.status(200).json({ message: "Admins deleted successfully" });
    } catch (error) {
      console.error("Delete admin error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const deleteFaculty = async (req: Request, res: Response) => {
    console.log("aaya delete faculty me")

    try {
      const facultyIds: string[] = req.body;
  
      await prisma.faculty.deleteMany({
        where: {
          id: { in: facultyIds },
        },
      });
  
      res.status(200).json({ message: "Faculty members deleted successfully" });
    } catch (error) {
      console.error("Delete faculty error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const deleteStudent = async (req: Request, res: Response) => {
    console.log("aaya del student me")

    try {
      const studentIds: string[] = req.body;
  
      await prisma.student.deleteMany({
        where: {
          id: { in: studentIds },
        },
      });
  
      res.status(200).json({ message: "Students deleted successfully" });
    } catch (error) {
      console.error("Delete student error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const deleteSubject = async (req: Request, res: Response) => {
    console.log("aaya delete subject")
    try {
      const subjectIds: string[] = req.body;
  
      await prisma.subject.deleteMany({
        where: {
          id: { in: subjectIds },
        },
      });
  
      res.status(200).json({ message: "Subjects deleted successfully" });
    } catch (error) {
      console.error("Delete subject error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const deleteDepartment = async (req: Request, res: Response) => {
    console.log("aaya delete department me")
    try {
      const { department } = req.body;
  
      await prisma.department.delete({
        where: { department },
      });
  
      res.status(200).json({ message: "Department deleted successfully" });
    } catch (error) {
      console.error("Delete department error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
export const addStudent = async (req: Request, res: Response) => {
  console.log("aaya add student me")
    const result = addStudentSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }
  
    try {
      const { email, department, dob, ...studentData } = result.data;
  
      const existingStudent = await prisma.student.findUnique({
        where: { email },
      });
  
      if (existingStudent) {
        return res.status(400).json({ error: "Email already exists" });
      }
  
      const departmentData = await prisma.department.findUnique({
        where: { department },
      });
  
      if (!departmentData) {
        return res.status(400).json({ error: "Department not found" });
      }
  
      const studentCount = await prisma.student.count({
        where: { department },
      });
  
      const date = new Date();
      const helper = studentCount.toString().padStart(3, '0');
      const username = `STU${date.getFullYear()}${departmentData.departmentCode}${helper}`;
  
      const hashedPassword = await bcrypt.hash(dob.split("-").reverse().join("-"), 10);
  
      const newStudent = await prisma.student.create({
        data: {
          email,
          department,
          dob,
          ...studentData,
          username,
          password: hashedPassword,
          passwordUpdated: false,
        },
      });
  
      // Add existing subjects for the student's year and department
      const subjects = await prisma.subject.findMany({
        where: {
          department,
          year: studentData.year.toString(),
        },
      });
  
      if (subjects.length > 0) {
        await prisma.student.update({
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
    } catch (error) {
      console.error("Add student error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getStudent = async (req: Request, res: Response) => {
    console.log("aaya get student me")
    const result = getStudentSchema.safeParse(req.body);
    
    if (!result.success) {
      return res.status(400).json({ errors: result.error.flatten() });
    }

    try {
      const { department, year, section } = result.data;
  
      const students = await prisma.student.findMany({
        where: {
          department,
          year,
          ...(section && { section }),
        },
      });
  
      if (students.length === 0) {
        return res.status(404).json({ error: "No students found" });
      }
  
      res.status(200).json({ result: students });
    } catch (error) {
      console.error("Get student error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getAllStudent = async (_req: Request, res: Response) => {
    console.log("aaya get all student me")
    try {
      const students = await prisma.student.findMany();
      res.status(200).json(students);
    } catch (error) {
      console.error("Get all students error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getAllFaculty = async (_req: Request, res: Response) => {
    console.log("aaya get all faculty me")
    try {
      const faculty = await prisma.faculty.findMany();
      res.status(200).json(faculty);
    } catch (error) {
      console.error("Get all faculty error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getAllAdmin = async (_req: Request, res: Response) => {
    console.log("aaya get all admin me")
    try {
      const admins = await prisma.admin.findMany();
      res.status(200).json(admins);
    } catch (error) {
      console.error("Get all admins error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getAllDepartment = async (_req: Request, res: Response) => {
    console.log("aaya get all department me")
    try {
      const departments = await prisma.department.findMany();
      res.status(200).json(departments);
    } catch (error) {
      console.error("Get all departments error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
  };
  
  export const getAllSubject = async (_req: Request, res: Response) => {
    console.log("aaya get all subject")
    try {
      const subjects = await prisma.subject.findMany();
      res.status(200).json(subjects);
    } catch (error) {
      console.error("Get all subjects error:", error);
      res.status(500).json({ error: "Internal server error." });
    }
};

