import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas using Zod
const loginSchema = z.object({
  username: z.string().min(1, "Username is required."),
  password: z.string().min(1, "Password is required."),
});

const updatePasswordSchema = z.object({
    newPassword: z.string()
      .min(6, "New password must be at least 6 characters long."),
    confirmPassword: z.string()
      .min(6, "Confirmation password must be at least 6 characters long."),
    email: z.string()
      .email("Invalid email format.")
      .min(1,"Email is required."),
  });

const updateStudentSchema = z.object({
  email: z.string().email("Invalid email format.").min(1,"Email is required."),
  name: z.string().optional(),
  dob: z.string().optional(),
  department: z.string().optional(),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
  batch: z.string().optional(),
  section: z.string().optional(),
  year: z.number().optional(),
  fatherName: z.string().optional(),
  motherName: z.string().optional(),
  fatherContactNumber: z.string().optional(),
});

const testResultSchema = z.object({
  department: z.string().min(1,"Department is required."),
  year: z.number().min(1, "Year must be a positive number."),
  section: z.string().min(1,"Section is required."),
});

const attendanceSchema = z.object({
  department: z.string().min(1,"Department is required."),
  year: z.number().min(1, "Year must be a positive number."),
  section: z.string().min(1,"Section is required."),
});

// Controller functions
export const studentLogin = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { username, password } = result.data;

  try {
    const existingStudent = await prisma.student.findUnique({
      where: { username: username },
    });

    if (!existingStudent) {
      return res.status(404).json({ error: "Student doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(password, existingStudent.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { email: existingStudent.email, id: existingStudent.id },
      process.env.JWT_SECRET_KEY || "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingStudent, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const result = updatePasswordSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { newPassword, email } = result.data;

  try {
    const student = await prisma.student.findUnique({
      where: { email },
    });

    if (!student) {
      return res.status(404).json({ error: "Student not found." });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    await prisma.student.update({
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
  } catch (error) {
    console.error("Update password error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updateStudent = async (req: Request, res: Response) => {
  const result = updateStudentSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { email } = result.data;

  try
  {
    const updatedStudent = await prisma.student.update({
      where: { email },
      data: req.body,
    });

    res.status(200).json(updatedStudent);
  } catch (error) {
    console.error("Update student error:", error);
    
    if ((error as any).code === 'P2025') { // Record not found
      return res.status(404).json({ error: "Student not found." });
    }

    res.status(500).json({ error: "Internal server error." });
  }
};

export const testResult = async (req: Request, res: Response) => {
   const result = testResultSchema.safeParse(req.body);
  
   if (!result.success) {
     return res.status(400).json({ errors : result.error.flatten()});
   }

   const { department, year, section } = result.data;

   try {
     const student = await prisma.student.findFirst({
       where:{department,year,section},
     });

     if (!student) {
       return res.status(404).json({ error:"Student not found."});
     }

     const tests = await prisma.test.findMany({
       where:{department, year: year.toString(), section},
     });

     if(tests.length ===0){
       return res.status(404).json({error:"No tests found."});
     }

     const results= await Promise.all(
       tests.map(async (test)=>{
         const marks= await prisma.marks.findFirst({
           where:{studentId : student.id , examId:test.id},
         });

         return marks 
           ? {
               marks : marks.marks,
               totalMarks : test.totalMarks,
               subjectCode : test.subjectCode,
               testName : test.test,
             }
           : null;
       })
     );

     res.status(200).json({results});
   } catch (error) {
     console.error("Test result retrieval error:", error);

     if (error instanceof Error && (error as any).code === 'P2025') { // Record not found
       return res.status(404).json({error:"Test not found."});
     }

     res.status(500).json({error:"Internal server error."});
   }
};

export const attendance = async (req : Request ,res : Response ) => {
   const result= attendanceSchema.safeParse(req.body);

   if(!result.success){
     return res.status(400).json({errors : result.error.flatten()});
   }

   const {department , year , section} = result.data;

   try{
     const student= await prisma.student.findFirst({
       where:{department , year , section},
     });

     if(!student){
       return res.status(404).json({error:"Student not found."});
     }

     const attendances= await prisma.attendance.findMany({
       where:{studentId : student.id},
       include:{subject:true},
     });

     if(!attendances.length){
       return res.status(404).json({message:"Attendance not found."});
     }

     const attendanceResults= attendances.map((att)=> ({
       percentage : ((att.lectureAttended / att.totalLecturesByFaculty)*100).toFixed(2),
       subjectCode : att.subject.subjectCode,
       subjectName : att.subject.subjectName,
       attendedLectures : att.lectureAttended,
       totalLecturesByFaculty : att.totalLecturesByFaculty,
     }));

     res.status(200).json({results : attendanceResults});
   } catch(error){
     console.error("Attendance retrieval error:",error);

     if ((error as any).code === 'P2025') { // Record not found
       return res.status(404).json({error:"Attendance not found."});
     }
     
     res.status(500).json({error:"Internal server error."});
   }
};