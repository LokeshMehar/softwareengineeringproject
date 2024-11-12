import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { z } from "zod";

const prisma = new PrismaClient();

// Validation schemas using Zod
const loginSchema = z.object({
  username: z.string().min(1,"Username is required."),
  password: z.string().min(1,"Password is required."),
});

const updatePasswordSchema = z.object({
  newPassword: z.string().min(6, "New password must be at least 6 characters long."),
  confirmPassword: z.string().min(6, "Confirmation password must be at least 6 characters long.")
,
  email: z.string().email("Invalid email format.").min(1, "Email is required."),
});

const updateFacultySchema = z.object({
  email: z.string().email("Invalid email format.").min(1, "Email is required."),
  name: z.string().optional(),
  dob: z.string().optional(),
  department: z.string().optional(),
  contactNumber: z.string().optional(),
  avatar: z.string().optional(),
  designation: z.string().optional(),
});

const createTestSchema = z.object({
  subjectCode: z.string().min(1, "Subject code is required."),
  department: z.string().min(1, "Department is required."),
  year: z.string().min(1, "Year is required."),
  section: z.string().min(1, "Section is required."),
  date: z.string().min(1, "Date is required."),
  test: z.string().min(1, "Test name is required."),
  totalMarks: z.number().min(0, "Total marks must be a non-negative number."),
});

const getStudentsSchema = z.object({
  department: z.string().min(1, "Department is required."),
  year: z.number().min(1, "Year must be a positive number."),
  section: z.string().min(1, "Section is required."),
});

const uploadMarksSchema = z.object({
  department: z.string().min(1, "Department is required."),
  year: z.number().min(1, "Year must be a positive number."),
  section: z.string().min(1, "Section is required."),
  test: z.string().min(1, "Test name is required."),
  marks: z.array(z.object({
    _id: z.string(),
    value: z.number(),
  })),
});

const markAttendanceSchema = z.object({
  selectedStudents: z.array(z.string()).min(1, "At least one student must be selected."),
  subjectName: z.string().min(1, "Subject name is required."),
  department: z.string().min(1, "Department is required."),
  year: z.number().min(1, "Year must be a positive number."),
  section: z.string().min(1, "Section is required."),
});

// Controller functions
export const facultyLogin = async (req: Request, res: Response) => {
  const result = loginSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  const { username, password } = result.data;

  try {
    const existingFaculty = await prisma.faculty.findUnique({
      where: { username: username },
    });

    if (!existingFaculty) {
      return res.status(404).json({ error: "Faculty doesn't exist." });
    }

    

    const isPasswordCorrect = await bcrypt.compare(password, existingFaculty.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ error: "Invalid credentials." });
    }

    const token = jwt.sign(
      { email: existingFaculty.email, id: existingFaculty.id },
      process.env.JWT_SECRET_KEY || "sEcReT",
      { expiresIn: "1h" }
    );

    res.status(200).json({ result: existingFaculty, token });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error." });
  }
};

export const updatedPassword = async (req: Request, res: Response) => {
   const result = updatePasswordSchema.safeParse(req.body);
  
   if (!result.success) {
     return res.status(400).json({ errors : result.error.flatten()});
   }

   const { newPassword, email } = result.data;

   try {
     const faculty = await prisma.faculty.findUnique({
       where:{email},
     });

     if (!faculty) {
       return res.status(404).json({ error:"Faculty not found."});
     }

     const hashedPassword = await bcrypt.hash(newPassword,10);

     await prisma.faculty.update({
       where:{email},
       data:{
         password : hashedPassword,
         passwordUpdated : true,
       },
     });

     res.status(200).json({
       success:true,
       message:"Password updated successfully.",
       response : faculty,
     });
   } catch (error) {
     console.error("Update password error:", error);
     res.status(500).json({error:"Internal server error."});
   }
};

export const updateFaculty = async (req : Request ,res : Response ) => {
   const result= updateFacultySchema.safeParse(req.body);

   if(!result.success){
     return res.status(400).json({errors : result.error.flatten()});
   }

   const { email } = result.data;

   try{
     const updatedFaculty= await prisma.faculty.update({
       where:{email},
       data:req.body,
     });

     res.status(200).json(updatedFaculty);
   } catch(error){
     console.error("Update faculty error:",error);

     if((error as any).code === 'P2025'){ // Record not found
       return res.status(404).json({error:"Faculty not found."});
     }

     res.status(500).json({error:"Internal server error."});
   }
};

export const createTest = async (req : Request ,res : Response ) => {
   const result= createTestSchema.safeParse(req.body);

   if(!result.success){
     return res.status(400).json({errors : result.error.flatten()});
   }

   const { subjectCode , department , year , section , date , test , totalMarks } = result.data;

   try{
     const existingTest= await prisma.test.findFirst({
       where:{
         subjectCode,
         department,
         year: year,
         section,
         test,
       },
     });

     if(existingTest){
       return res.status(400).json({error:"Given Test is already created"});
     }

     const newTest= await prisma.test.create({
       data:{
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
       success:true,
       message:"Test added successfully",
       response:newTest,
     });
   } catch(error){
     console.error("Create test error:",error);
     res.status(500).json({error:"Internal server error."});
   }
};

export const getTest = async (req : Request ,res : Response ) => {
   try{
     const { department , year , section } = req.body;

     const tests= await prisma.test.findMany({
       where:{
         department,
         year,
         section,
       },
     });

     res.status(200).json({result : tests});
   } catch(error){
     console.error("Get tests error:",error);
     res.status(500).json({error:"Internal server error."});
   }
};

export const getStudent = async (req : Request ,res : Response ) => {
   const result= getStudentsSchema.safeParse(req.body);

   if(!result.success){
     return res.status(400).json({errors : result.error.flatten()});
   }

   const { department , year , section } = result.data;

   try{
     const students= await prisma.student.findMany({
       where:{
         department,
         year,
         section,
       },
     });

     if(students.length ===0){
       return res.status(404).json({error:"No Student Found"});
     }

     res.status(200).json({result : students});
   } catch(error){
      console.error("Get students error:",error);
      res.status(500).json({error:"Internal server error."});
   }
};

export const uploadMarks = async (req : Request ,res : Response ) => {
   const result= uploadMarksSchema.safeParse(req.body);

   if(!result.success){
      return res.status(400).json({errors : result.error.flatten()});
   }

   const { department , year , section , test , marks } = result.data;

   try{
      const existingTest= await prisma.test.findFirst({
        where:{
          department,
          year: year.toString(),
          section,
          test
        },
      });

      if(!existingTest){
        return res.status(404).json({error:"Test not found."});
      }

      // Check for already uploaded marks
      const existingMarks= await prisma.marks.findMany({
        where:{
          examId : existingTest.id
        },
      });

      if(existingMarks.length !==0){
        return res.status(400).json({error:"You have already uploaded marks for the given exam"});
      }

      for(const mark of marks){
        await prisma.marks.create({
          data:{
            studentId : mark._id,
            examId : existingTest.id,
            marks : mark.value
          },
        });
      }

      res.status(200).json({message:"Marks uploaded successfully"});
      
    } catch(error){
      console.error("Upload marks error:",error);
      res.status(500).json({error:"Internal server error."});
    }
};

export const markAttendance = async (req : Request ,res : Response ) => {
   const result= markAttendanceSchema.safeParse(req.body);

   if(!result.success){
      return res.status(400).json({errors : result.error.flatten()});
   }

   const { selectedStudents , subjectName , department , year , section } = result.data;

   try{
      // Find the subject
      const subject= await prisma.subject.findUnique({
        where:{subjectName},
      });

      if(!subject){
        return res.status(404).json({error:"Subject not found."});
      }

      // Find all students in the given class
      const allStudents= await prisma.student.findMany({
        where:{
          department ,
          year ,
          section ,
        },
      });

      for(const student of allStudents){
        let attendanceRecord= await prisma.attendance.findFirst({
          where:{
            studentId : student.id ,
            subjectId : subject.id ,
          },
        });

        // If attendance record does not exist for this student and subject
        if(!attendanceRecord){
          attendanceRecord= await prisma.attendance.create({
            data:{
              studentId : student.id ,
              subjectId : subject.id ,
              totalLecturesByFaculty :1 ,
              lectureAttended :0 ,
            },
          });
        } else {
          attendanceRecord.totalLecturesByFaculty +=1;
          await prisma.attendance.update({
            where:{
              id : attendanceRecord.id ,
            },
            data:{
              totalLecturesByFaculty : attendanceRecord.totalLecturesByFaculty ,
            },
          });
        }
      }

      for(const studentId of selectedStudents){
        let attendanceRecord= await prisma.attendance.findFirst({
          where:{
              studentId : studentId ,
              subjectId : subject.id ,
          },
        });

        // If attendance record does not exist for this selected student and subject
        if(!attendanceRecord){
          attendanceRecord= await prisma.attendance.create({
            data:{
              studentId ,
              subjectId : subject.id ,
              totalLecturesByFaculty :0 ,
              lectureAttended :1 ,
            },
          });
        } else {
          attendanceRecord.lectureAttended +=1;
          await prisma.attendance.update({
            where:{
              id : attendanceRecord.id ,
            },
            data:{
              lectureAttended : attendanceRecord.lectureAttended ,
            },
          });
        }
      }
      
      res.status(200).json({message:"Attendance marked successfully"});
      
    } catch(error){
      console.error("Mark attendance error:",error);
      
      if((error as any).code === 'P2025'){ // Record not found
        return res.status(404).json({error:"Attendance record not found."});
      }
      
      res.status(500).json({error:"Internal server error."});
    }
};



export const addStudyMaterial = async (req: Request, res: Response) => {
  const studyMaterialSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    fileUrl: z.string().url('File URL must be a valid URL'),
    subject: z.string().min(1, 'Subject is required'),
    year: z.number().positive('Year must be a positive number'),
    department: z.string().min(1, 'Department is required'),
    section: z.string().min(1, 'Section is required')
  });

  const result = studyMaterialSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ errors: result.error.flatten() });
  }

  try {
    const existingMaterial = await prisma.studyMaterial.findFirst({
      where: {
        title: result.data.title,
        subject: result.data.subject,
        year: result.data.year,
        department: result.data.department,
        section: result.data.section
      }
    });

    if (existingMaterial) {
      return res.status(400).json({ error: 'Study material already exists' });
    }

    const newMaterial = await prisma.studyMaterial.create({
      data: result.data
    });

    res.status(201).json({
      success: true,
      message: 'Study material added successfully',
      response: newMaterial
    });
  } catch (error) {
    console.error('Add study material error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getStudyMaterials = async (req: Request, res: Response) => {
  try {
    const studyMaterials = await prisma.studyMaterial.findMany();
    res.status(200).json({
      success: true,
      response: studyMaterials
    });
  } catch (error) {
    console.error('Get study materials error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteStudyMaterial = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const studyMaterial = await prisma.studyMaterial.findUnique({
      where: {
        id
      }
    });

    if (!studyMaterial) {
      return res.status(404).json({ error: 'Study material not found' });
    }

    await prisma.studyMaterial.delete({
      where: {
        id
      }
    });

    res.status(200).json({
      success: true,
      message: 'Study material deleted successfully'
    });
  } catch (error) {
    console.error('Delete study material error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};