import express, { Request, Response } from "express";
import cors from "cors";
import dotenv from "dotenv";

import adminRoutes from "./routes/adminRoutes";
import studentRoutes from "./routes/studentRoutes";
import facultyRoutes from "./routes/facultyRoutes";
import { addDummyAdmin } from "./controllers/adminController";
import bodyParser from "body-parser";

dotenv.config();

const app = express();

// Built-in middleware for parsing JSON
app.use(express.json({ limit: "30mb" }));


// Built-in middleware for parsing URL-encoded data
app.use(express.urlencoded({ limit: "30mb", extended: true }));

// Enable CORS
app.use(
  cors({
    origin: 'https://universitymanagementsystem.vercel.app', // Allow Vercel frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow specific methods
    credentials: true // Allow cookies to be sent if needed
  })
);


// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/faculty", facultyRoutes);
app.use("/api/student", studentRoutes);

// Root route
app.get("/", (req: Request, res: Response) => {
  res.send("Hello to college ERP API");
});
const PORT = process.env.PORT || 5001;

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  try {
    await addDummyAdmin();
  } catch (error) {
    console.log("Database connection failed");
  }
});

