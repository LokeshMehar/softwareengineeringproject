"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const facultyController_1 = require("../controllers/facultyController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const rateLimiters_1 = require("../utils/rateLimiters");
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
const router = express_1.default.Router();
// Define routes with configuration
const routes = [
    {
        path: '/login',
        method: 'post',
        handler: facultyController_1.facultyLogin,
        requiresAuth: false,
        description: 'Faculty login endpoint',
        rateLimit: rateLimiters_1.loginRateLimiter
    },
    {
        path: '/updatepassword',
        method: 'post',
        handler: facultyController_1.updatedPassword,
        requiresAuth: true,
        description: 'Update faculty password',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/updateprofile',
        method: 'post',
        handler: facultyController_1.updateFaculty,
        requiresAuth: true,
        description: 'Update faculty profile information',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/createtest',
        method: 'post',
        handler: facultyController_1.createTest,
        requiresAuth: true,
        description: 'Create new test/exam',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/gettest',
        method: 'post',
        handler: facultyController_1.getTest,
        requiresAuth: true,
        description: 'Retrieve test details',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getstudent',
        method: 'post',
        handler: facultyController_1.getStudent,
        requiresAuth: true,
        description: 'Get student information',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/uploadmarks',
        method: 'post',
        handler: facultyController_1.uploadMarks,
        requiresAuth: true,
        description: 'Upload student marks',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/markattendance',
        method: 'post',
        handler: facultyController_1.markAttendance,
        requiresAuth: true,
        description: 'Mark student attendance',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/study-materials',
        method: 'post',
        handler: facultyController_1.addStudyMaterial,
        requiresAuth: true,
        description: 'Add new study material',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/study-materials',
        method: 'get',
        handler: facultyController_1.getStudyMaterials,
        requiresAuth: true,
        description: 'Get all study materials',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/study-materials/:id',
        method: 'delete',
        handler: facultyController_1.deleteStudyMaterial,
        requiresAuth: true,
        description: 'Delete a study material',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/addstudymaterial',
        method: 'post',
        handler: facultyController_1.addStudyMaterial,
        requiresAuth: true,
        description: 'Add new study material',
        rateLimit: rateLimiters_1.authRateLimiter
    },
];
// Request body validation middleware
const validateRequestBody = (req, res, next) => {
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
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Register routes
routes.forEach(({ path, method, handler, requiresAuth, rateLimit: rateLimiter }) => {
    const handlers = [validateRequestBody];
    if (rateLimiter) {
        handlers.push(rateLimiter);
    }
    if (requiresAuth) {
        handlers.push(auth_1.default);
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
router.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.path} not found`,
        path: req.path,
        timestamp: new Date().toISOString()
    });
});
// Error handler middleware
router.use((err, req, res, _next) => {
    console.error('Error:', {
        name: err.name,
        message: err.message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
    const statusCode = err.statusCode || 500;
    const details = err.details;
    res.status(statusCode).json(Object.assign(Object.assign({ success: false, message: err.message || 'Internal server error' }, (details && { details })), (process.env.NODE_ENV === 'development' && { error: err.message })));
});
exports.default = router;
