import { Request, Response, NextFunction } from 'express';
import { verifyToken, TokenPayload } from '../utils/jwt.js';
import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { userRepository } from '../repositories/user.repository.js';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload & { fullName?: string };
    }
  }
}

export async function optionalAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.randere_token) {
      token = req.cookies.randere_token;
    }

    if (token) {
      const decoded = verifyToken(token);
      req.user = decoded;
    }
  } catch (err) {
    // optional, proceed without req.user
  }
  next();
}

export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  try {
    const authHeader = req.headers.authorization;
    let token: string | undefined;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.cookies && req.cookies.randere_token) {
      token = req.cookies.randere_token;
    }

    if (!token) {
      return next(new UnauthorizedError('Authentication token required'));
    }

    const decoded = verifyToken(token);
    const user = await userRepository.findById(decoded.userId);
    if (!user) {
      return next(new UnauthorizedError('User account not found'));
    }

    req.user = {
      userId: user.id,
      email: user.email,
      role: user.role,
      fullName: user.full_name,
    };

    next();
  } catch (error) {
    next(new UnauthorizedError('Invalid or expired token'));
  }
}

export function requireRole(allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError('Authentication required'));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError(`Access restricted to roles: ${allowedRoles.join(', ')}`));
    }

    next();
  };
}
