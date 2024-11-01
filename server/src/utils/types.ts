import { Request, Response, NextFunction } from 'express';
import { RateLimitRequestHandler } from 'express-rate-limit';



// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
    }
  }


}

export interface ApiError extends Error {
    statusCode?: number;
    details?: any;
  }

export class CustomApiError extends Error {
    statusCode: number;
    details?: Record<string, any>;
  
    constructor(
      statusCode: number,
      message: string,
      details?: Record<string, any>
    ) {
      super(message);
      this.statusCode = statusCode;
      this.details = details;
      this.name = 'CustomApiError';
  
      // Ensures proper prototype chain for instanceof checks
      Object.setPrototypeOf(this, CustomApiError.prototype);
    }
  }

// Types for route configuration
export interface RouteConfig {
    path: string;
    method: 'get' | 'post' | 'put' | 'delete';
    handler: (req: Request, res: Response, next: NextFunction) => Promise<any>;
    requiresAuth?: boolean;
    middleware?: Array<(req: Request, res: Response, next: NextFunction) => void>;
    description?: string;
    rateLimit?: RateLimitRequestHandler;
}