import { Request, Response, NextFunction, Router } from 'express';
import rateLimit, { RateLimitRequestHandler } from 'express-rate-limit';
import {
  studentLogin,
  updatePassword,
  updateStudent,
  testResult,
  attendance,
  getStudyMaterials,
  feedback,
} from '../controllers/studentController';
import auth from '../middlewares/auth';
import { CustomApiError, RouteConfig,  } from '../utils/types';
import { authRateLimiter, loginRateLimiter } from '../utils/rateLimiters';

// Types for route configuration
// interface RouteConfig {
//   path: string;
//   method: 'get' | 'post' | 'put' | 'delete';
//   handler: (req: Request, res: Response, next: NextFunction) => Promise<any>;
//   middleware: Array<(req: Request, res: Response, next: NextFunction) => void>;
//   rateLimit?: RateLimitRequestHandler;
// }

// Create rate limiters
// const authRateLimiter = rateLimit({
//   windowMs: 15 * 60 * 1000, // 15 minutes
//   max: 100,
//   message: {
//     success: false,
//     message: 'Too many requests from this IP. Please try again later.',
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
//     message: 'Too many login attempts. Account locked temporarily.',
//     details: {
//       retryAfter: '60 minutes'
//     }
//   },
//   skipSuccessfulRequests: true,
//   standardHeaders: true,
//   legacyHeaders: false,
// });

const router = Router();

// Define routes with configuration
const routes: RouteConfig[] = [
  {
    path: '/login',
    method: 'post',
    handler: studentLogin,
    middleware: [],
    rateLimit: loginRateLimiter,
  },
  {
    path: '/updatepassword',
    method: 'post',
    handler: updatePassword,
    middleware: [auth],
    rateLimit: authRateLimiter,
  },
  {
    path: '/updateprofile',
    method: 'post',
    handler: updateStudent,
    middleware: [auth],
    rateLimit: authRateLimiter,
  },
  {
    path: '/testresult',
    method: 'post',
    handler: testResult,
    middleware: [auth],
    rateLimit: authRateLimiter,
  },
  {
    path: '/attendance',
    method: 'post',
    handler: attendance,
    middleware: [auth],
    rateLimit: authRateLimiter,
  },
  
  {
    path: '/studymaterial',
    method: 'post',
    handler: getStudyMaterials,
    middleware: [auth],
    rateLimit: authRateLimiter,
  },
  
  {
    path: '/feedback',
    method: 'post',
    handler: feedback,
    middleware: [auth],
    rateLimit: authRateLimiter,
  },
];

// Simplified error handler wrapper
const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => 
  (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Register routes
routes.forEach(({ path, method, handler, middleware, rateLimit: rateLimiter }) => {
  const handlers = [];

  if (rateLimiter) {
    handlers.push(rateLimiter);
  }

  handlers.push(...middleware as any);
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
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Simple error handler
router.use((err: any, req: Request, res: Response, _next: NextFunction) => {
  console.error('Error:', {
    message: err.message,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  if (err instanceof CustomApiError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      details: err.details,
    });
    return;
  }

  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' ? { error: err.message } : {}),
  });
});

export default router;