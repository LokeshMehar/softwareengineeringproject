import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET_KEY;

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET is not defined in environment variables');
}

interface DecodedToken {
    id: string;
    // Add other JWT payload fields if needed
    iat?: number;
    exp?: number;
}
const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  // Set security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      res.status(401).json({ 
        success: false,
        message: 'Authorization header is missing' 
      });
      return;
    }

    // Verify token format
    if (!authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false,
        message: 'Invalid authorization format. Use Bearer token' 
      });
      return;
    }

    const token = authHeader.split(' ')[1];
    
    if (!token) {
      res.status(401).json({ 
        success: false,
        message: 'Token is missing' 
      });
      return;
    }

    try {
      const decodedData = jwt.verify(token, JWT_SECRET) as DecodedToken;
      
      // Check token expiration explicitly
      if (decodedData.exp && Date.now() >= decodedData.exp * 1000) {
        res.status(401).json({ 
          success: false,
          message: 'Token has expired' 
        });
        return;
      }

      req.userId = decodedData.id;
      next();
    } catch (jwtError) {
      if (jwtError instanceof jwt.TokenExpiredError) {
        res.status(401).json({ 
          success: false,
          message: 'Token has expired' 
        });
      } else if (jwtError instanceof jwt.JsonWebTokenError) {
        res.status(401).json({ 
          success: false,
          message: 'Invalid token' 
        });
      } else {
        res.status(401).json({ 
          success: false,
          message: 'Token validation failed' 
        });
      }
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Internal server error during authentication',
      ...(process.env.NODE_ENV === 'development' && { error: (error as Error).message })
    });
  }
};

export default auth;