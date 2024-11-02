"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const adminController_1 = require("../controllers/adminController");
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
const router = express_1.default.Router();
// Define routes with configuration
const routes = [
    {
        path: '/login',
        method: 'post',
        handler: adminController_1.adminLogin,
        requiresAuth: false,
        description: 'Admin login endpoint',
        rateLimit: rateLimiters_1.loginRateLimiter
    },
    {
        path: '/updatepassword',
        method: 'post',
        handler: adminController_1.updatedPassword,
        requiresAuth: true,
        description: 'Update admin password',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getallstudent',
        method: 'get',
        handler: adminController_1.getAllStudent,
        requiresAuth: true,
        description: 'Get all students',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/createnotice',
        method: 'post',
        handler: adminController_1.createNotice,
        requiresAuth: true,
        description: 'Create new notice',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getallfaculty',
        method: 'get',
        handler: adminController_1.getAllFaculty,
        requiresAuth: true,
        description: 'Get all faculty members',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getalldepartment',
        method: 'get',
        handler: adminController_1.getAllDepartment,
        requiresAuth: true,
        description: 'Get all departments',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getallsubject',
        method: 'get',
        handler: adminController_1.getAllSubject,
        requiresAuth: true,
        description: 'Get all subjects',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getalladmin',
        method: 'get',
        handler: adminController_1.getAllAdmin,
        requiresAuth: true,
        description: 'Get all administrators',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/updateprofile',
        method: 'post',
        handler: adminController_1.updateAdmin,
        requiresAuth: true,
        description: 'Update admin profile',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/addadmin',
        method: 'post',
        handler: adminController_1.addAdmin,
        requiresAuth: true,
        description: 'Add new administrator',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/adddepartment',
        method: 'post',
        handler: adminController_1.addDepartment,
        requiresAuth: true,
        description: 'Add new department',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/addfaculty',
        method: 'post',
        handler: adminController_1.addFaculty,
        requiresAuth: true,
        description: 'Add new faculty member',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getfaculty',
        method: 'post',
        handler: adminController_1.getFaculty,
        requiresAuth: true,
        description: 'Get faculty details',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/addsubject',
        method: 'post',
        handler: adminController_1.addSubject,
        requiresAuth: true,
        description: 'Add new subject',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getsubject',
        method: 'post',
        handler: adminController_1.getSubject,
        requiresAuth: true,
        description: 'Get subject details',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/addstudent',
        method: 'post',
        handler: adminController_1.addStudent,
        requiresAuth: true,
        description: 'Add new student',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getstudent',
        method: 'post',
        handler: adminController_1.getStudent,
        requiresAuth: true,
        description: 'Get student details',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getnotice',
        method: 'post',
        handler: adminController_1.getNotice,
        requiresAuth: true,
        description: 'Get notice details',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/getadmin',
        method: 'post',
        handler: adminController_1.getAdmin,
        requiresAuth: true,
        description: 'Get admin details',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/deleteadmin',
        method: 'post',
        handler: adminController_1.deleteAdmin,
        requiresAuth: true,
        description: 'Delete administrator',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/deletefaculty',
        method: 'post',
        handler: adminController_1.deleteFaculty,
        requiresAuth: true,
        description: 'Delete faculty member',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/deletestudent',
        method: 'post',
        handler: adminController_1.deleteStudent,
        requiresAuth: true,
        description: 'Delete student',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/deletedepartment',
        method: 'post',
        handler: adminController_1.deleteDepartment,
        requiresAuth: true,
        description: 'Delete department',
        rateLimit: rateLimiters_1.authRateLimiter
    },
    {
        path: '/deletesubject',
        method: 'post',
        handler: adminController_1.deleteSubject,
        requiresAuth: true,
        description: 'Delete subject',
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
