"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const studentController_1 = require("../controllers/studentController");
const auth_1 = __importDefault(require("../middlewares/auth"));
const types_1 = require("../utils/types");
const rateLimiters_1 = require("../utils/rateLimiters");
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
const router = (0, express_1.Router)();
// Define routes with configuration
const routes = [
    {
        path: '/login',
        method: 'post',
        handler: studentController_1.studentLogin,
        middleware: [],
        rateLimit: rateLimiters_1.loginRateLimiter,
    },
    {
        path: '/updatepassword',
        method: 'post',
        handler: studentController_1.updatePassword,
        middleware: [auth_1.default],
        rateLimit: rateLimiters_1.authRateLimiter,
    },
    {
        path: '/updateprofile',
        method: 'post',
        handler: studentController_1.updateStudent,
        middleware: [auth_1.default],
        rateLimit: rateLimiters_1.authRateLimiter,
    },
    {
        path: '/testresult',
        method: 'post',
        handler: studentController_1.testResult,
        middleware: [auth_1.default],
        rateLimit: rateLimiters_1.authRateLimiter,
    },
    {
        path: '/attendance',
        method: 'post',
        handler: studentController_1.attendance,
        middleware: [auth_1.default],
        rateLimit: rateLimiters_1.authRateLimiter,
    },
    {
        path: '/studymaterial',
        method: 'post',
        handler: studentController_1.getStudyMaterials,
        middleware: [auth_1.default],
        rateLimit: rateLimiters_1.authRateLimiter,
    },
    {
        path: '/feedback',
        method: 'post',
        handler: studentController_1.feedback,
        middleware: [auth_1.default],
        rateLimit: rateLimiters_1.authRateLimiter,
    },
];
// Simplified error handler wrapper
const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
// Register routes
routes.forEach(({ path, method, handler, middleware, rateLimit: rateLimiter }) => {
    const handlers = [];
    if (rateLimiter) {
        handlers.push(rateLimiter);
    }
    handlers.push(...middleware);
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
        message: `Route ${req.method} ${req.path} not found`
    });
});
// Simple error handler
router.use((err, req, res, _next) => {
    console.error('Error:', {
        message: err.message,
        path: req.path,
        method: req.method,
        timestamp: new Date().toISOString(),
    });
    if (err instanceof types_1.CustomApiError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
            details: err.details,
        });
        return;
    }
    res.status(500).json(Object.assign({ success: false, message: 'Internal Server Error' }, (process.env.NODE_ENV === 'development' ? { error: err.message } : {})));
});
exports.default = router;
