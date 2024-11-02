import express, { Router, Request, Response, NextFunction } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import {
  facultyLogin,
  updatedPassword,
  updateFaculty,
  createTest,
  getTest,
  getStudent,
  uploadMarks,
  markAttendance,
} from '../controllers/facultyController';
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



const router: Router = express.Router();

// Define routes with configuration
const routes: RouteConfig[] = [
  {
    path: '/login',
    method: 'post',
    handler: facultyLogin,
    requiresAuth: false,
    description: 'Faculty login endpoint',
    rateLimit: loginRateLimiter
  },
  {
    path: '/updatepassword',
    method: 'post',
    handler: updatedPassword,
    requiresAuth: true,
    description: 'Update faculty password',
    rateLimit: authRateLimiter
  },
  {
    path: '/updateprofile',
    method: 'post',
    handler: updateFaculty,
    requiresAuth: true,
    description: 'Update faculty profile information',
    rateLimit: authRateLimiter
  },
  {
    path: '/createtest',
    method: 'post',
    handler: createTest,
    requiresAuth: true,
    description: 'Create new test/exam',
    rateLimit: authRateLimiter
  },
  {
    path: '/gettest',
    method: 'post',
    handler: getTest,
    requiresAuth: true,
    description: 'Retrieve test details',
    rateLimit: authRateLimiter
  },
  {
    path: '/getstudent',
    method: 'post',
    handler: getStudent,
    requiresAuth: true,
    description: 'Get student information',
    rateLimit: authRateLimiter
  },
  {
    path: '/uploadmarks',
    method: 'post',
    handler: uploadMarks,
    requiresAuth: true,
    description: 'Upload student marks',
    rateLimit: authRateLimiter
  },
  {
    path: '/markattendance',
    method: 'post',
    handler: markAttendance,
    requiresAuth: true,
    description: 'Mark student attendance',
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