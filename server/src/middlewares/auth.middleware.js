import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const authenticateJWT = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Authentication required. Please log in.', 401, 'UNAUTHORIZED');
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET || 'worknear_super_secure_jwt_secret_key_2026_hyderabad';

  try {
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new AppError('The user belonging to this token no longer exists or is inactive.', 401, 'UNAUTHORIZED');
    }

    req.user = {
      userId: user._id.toString(),
      role: user.role,
      name: user.name,
      phone: user.phone
    };
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      throw new AppError('Invalid token signature. Please log in again.', 401, 'INVALID_TOKEN');
    }
    if (error.name === 'TokenExpiredError') {
      throw new AppError('Your session has expired. Please log in again.', 401, 'TOKEN_EXPIRED');
    }
    throw error;
  }
});

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError(
        `Access denied. This action requires one of the following roles: [${allowedRoles.join(', ')}]`,
        403,
        'FORBIDDEN'
      );
    }
    next();
  };
};
