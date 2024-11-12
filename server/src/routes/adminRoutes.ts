import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import {
  adminLogin,
  updateAdmin,
  addAdmin,
  addFaculty,
  getFaculty,
  addSubject,
  getSubject,
  addStudent,
  getStudent,
  addDepartment,
  getAllStudent,
  getAllFaculty,
  getAllAdmin,
  getAllDepartment,
  getAllSubject,
  updatedPassword,
  getAdmin,
  deleteAdmin,
  deleteDepartment,
  deleteFaculty,
  deleteStudent,
  deleteSubject,
  createNotice,
  getNotice,
  getFeedback,
} from '../controllers/adminController';
import auth from '../middlewares/auth';
import { RouteConfig, ApiError } from '../utils/types';
import { authRateLimiter, loginRateLimiter } from '../utils/rateLimiters';

// Types for better error handling
// interface ApiError extends Error {
//   statusCode?: number;
//   details?: any;
// }

// Route configuration interface
// interface RouteConfig {
//   path: string;
//   method: 'get' | 'post' | 'put' | 'delete';
//   handler: (req: Request, res: Response, next: NextFunction) => Promise<any>;
//   requiresAuth: boolean;
//   description: string;
//   rateLimit?: RateLimitRequestHandler;
// }

// Create rate limiters
// const authRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: {
//     success: false,
//     message: 'Too many requests. Please try again later.',
//     details: {
//       retryAfter: '15 minutes'
//     }
//   },
//   standardHeaders: true,
//   legacyHeaders: false,
// });

// const loginRateLimiter = rateLimit({
//   windowMs: 60 * 60 * 1000, // 1 hour
//   max: 5,
//   message: {
//     success: false,
//     message: 'Too many login attempts. Please try again later.',
//     details: {
//       retryAfter: '60 minutes'
//     }
//   },
//   skipSuccessfulRequests: true,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

const router: Router = express.Router();

// Define routes with configuration
const routes: RouteConfig[] = [
  {
    path: '/login',
    method: 'post',
    handler: adminLogin,
    requiresAuth: false,
    description: 'Admin login endpoint',
    rateLimit: loginRateLimiter
  },
  {
    path: '/updatepassword',
    method: 'post',
    handler: updatedPassword,
    requiresAuth: true,
    description: 'Update admin password',
    rateLimit: authRateLimiter
  },
  {
    path: '/getallstudent',
    method: 'get',
    handler: getAllStudent,
    requiresAuth: true,
    description: 'Get all students',
    rateLimit: authRateLimiter
  },
  {
    path: '/createnotice',
    method: 'post',
    handler: createNotice,
    requiresAuth: true,
    description: 'Create new notice',
    rateLimit: authRateLimiter
  },
  {
    path: '/getallfaculty',
    method: 'get',
    handler: getAllFaculty,
    requiresAuth: true,
    description: 'Get all faculty members',
    rateLimit: authRateLimiter
  },
  {
    path: '/getalldepartment',
    method: 'get',
    handler: getAllDepartment,
    requiresAuth: true,
    description: 'Get all departments',
    rateLimit: authRateLimiter
  },
  {
    path: '/getallsubject',
    method: 'get',
    handler: getAllSubject,
    requiresAuth: true,
    description: 'Get all subjects',
    rateLimit: authRateLimiter
  },
  {
    path: '/getalladmin',
    method: 'get',
    handler: getAllAdmin,
    requiresAuth: true,
    description: 'Get all administrators',
    rateLimit: authRateLimiter
  },
  {
    path: '/updateprofile',
    method: 'post',
    handler: updateAdmin,
    requiresAuth: true,
    description: 'Update admin profile',
    rateLimit: authRateLimiter
  },
  {
    path: '/addadmin',
    method: 'post',
    handler: addAdmin,
    requiresAuth: true,
    description: 'Add new administrator',
    rateLimit: authRateLimiter
  },
  {
    path: '/adddepartment',
    method: 'post',
    handler: addDepartment,
    requiresAuth: true,
    description: 'Add new department',
    rateLimit: authRateLimiter
  },
  {
    path: '/addfaculty',
    method: 'post',
    handler: addFaculty,
    requiresAuth: true,
    description: 'Add new faculty member',
    rateLimit: authRateLimiter
  },
  {
    path: '/getfaculty',
    method: 'post',
    handler: getFaculty,
    requiresAuth: true,
    description: 'Get faculty details',
    rateLimit: authRateLimiter
  },
  {
    path: '/addsubject',
    method: 'post',
    handler: addSubject,
    requiresAuth: true,
    description: 'Add new subject',
    rateLimit: authRateLimiter
  },
  {
    path: '/getsubject',
    method: 'post',
    handler: getSubject,
    requiresAuth: true,
    description: 'Get subject details',
    rateLimit: authRateLimiter
  },
  {
    path: '/addstudent',
    method: 'post',
    handler: addStudent,
    requiresAuth: true,
    description: 'Add new student',
    rateLimit: authRateLimiter
  },
  {
    path: '/getstudent',
    method: 'post',
    handler: getStudent,
    requiresAuth: true,
    description: 'Get student details',
    rateLimit: authRateLimiter
  },
  {
    path: '/getnotice',
    method: 'post',
    handler: getNotice,
    requiresAuth: true,
    description: 'Get notice details',
    rateLimit: authRateLimiter
  },
  {
    path: '/getadmin',
    method: 'post',
    handler: getAdmin,
    requiresAuth: true,
    description: 'Get admin details',
    rateLimit: authRateLimiter
  },
  {
    path: '/deleteadmin',
    method: 'post',
    handler: deleteAdmin,
    requiresAuth: true,
    description: 'Delete administrator',
    rateLimit: authRateLimiter
  },
  {
    path: '/deletefaculty',
    method: 'post',
    handler: deleteFaculty,
    requiresAuth: true,
    description: 'Delete faculty member',
    rateLimit: authRateLimiter
  },
  {
    path: '/deletestudent',
    method: 'post',
    handler: deleteStudent,
    requiresAuth: true,
    description: 'Delete student',
    rateLimit: authRateLimiter
  },
  {
    path: '/deletedepartment',
    method: 'post',
    handler: deleteDepartment,
    requiresAuth: true,
    description: 'Delete department',
    rateLimit: authRateLimiter
  },
  {
    path: '/deletesubject',
    method: 'post',
    handler: deleteSubject,
    requiresAuth: true,
    description: 'Delete subject',
    rateLimit: authRateLimiter
  },
  
  {
    path: '/feedback',
    method: 'post',
    handler: getFeedback,
    requiresAuth: true,
    description: 'Get required feedback',
    rateLimit: authRateLimiter
  },
];

// Request body validation middleware
const validateRequestBody = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'POST' && !req.body) {
    res.status(400).json({
      success: false,
      message: 'Request body is required for POST requests',
      path: req.path
    });
    return;
  }
  next();
};

// Simplified async handler
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Register routes
routes.forEach(({ path, method, handler, requiresAuth, rateLimit: rateLimiter }) => {
  const handlers = [validateRequestBody];

  if (rateLimiter) {
    handlers.push(rateLimiter);
  }

  if (requiresAuth) {
    handlers.push(auth);
  }

  handlers.push(asyncHandler(handler));

  switch (method) {
    case 'get':
      router.get(path, ...handlers);
      break;
    case 'post':
      router.post(path, ...handlers);
      break;
    case 'put':
      router.put(path, ...handlers);
      break;
    case 'delete':
      router.delete(path, ...handlers);
      break;
  }
});

// 404 handler
router.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found`,
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Error handler middleware
router.use((err: Error | ApiError, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', {
    name: err.name,
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });

  const statusCode = (err as ApiError).statusCode || 500;
  const details = (err as ApiError).details;

  res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(details && { details }),
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

export default router;
export type { ApiError, RouteConfig };