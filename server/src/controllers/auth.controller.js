import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { EmployerProfile } from '../models/EmployerProfile.js';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const generateToken = (userId, role) => {
  const secret = process.env.JWT_SECRET || 'worknear_super_secure_jwt_secret_key_2026_hyderabad';
  const expiresIn = process.env.JWT_EXPIRES_IN || '7d';
  return jwt.sign({ userId, role }, secret, { expiresIn });
};

export const register = asyncHandler(async (req, res) => {
  const { name, phone, password, role = 'worker', locality = 'Madhapur', businessName } = req.body;

  if (!name || !phone || !password) {
    throw new AppError('Name, phone number, and password are required', 400, 'MISSING_FIELDS');
  }

  if (password.length < 6) {
    throw new AppError('Password must be at least 6 characters long', 400, 'WEAK_PASSWORD');
  }

  // Check if phone is already registered
  const existingUser = await User.findOne({ phone: phone.trim() });
  if (existingUser) {
    throw new AppError('A user with this phone number already exists', 409, 'DUPLICATE_PHONE');
  }

  // Create user
  const user = await User.create({
    name: name.trim(),
    phone: phone.trim(),
    password,
    role: ['worker', 'employer'].includes(role) ? role : 'worker',
    isPhoneVerified: true
  });

  // Automatically initialize role-specific profile with Hyderabad defaults
  let profile = null;
  if (user.role === 'worker') {
    profile = await WorkerProfile.create({
      userId: user._id,
      locality: locality.trim() || 'Madhapur',
      city: 'Hyderabad'
    });
  } else if (user.role === 'employer') {
    profile = await EmployerProfile.create({
      userId: user._id,
      businessName: (businessName && businessName.trim()) || `${user.name}'s Business`,
      address: {
        locality: locality.trim() || 'Madhapur',
        city: 'Hyderabad'
      }
    });
  }

  const token = generateToken(user._id, user.role);

  return new ApiResponse(res, 201, 'Registration successful', {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role
    },
    profile,
    token
  });
});

export const login = asyncHandler(async (req, res) => {
  const { phone, password } = req.body;

  if (!phone || !password) {
    throw new AppError('Phone number and password are required', 400, 'MISSING_CREDENTIALS');
  }

  const user = await User.findOne({ phone: phone.trim() }).select('+password');
  if (!user) {
    throw new AppError('Invalid phone number or password', 401, 'INVALID_CREDENTIALS');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new AppError('Invalid phone number or password', 401, 'INVALID_CREDENTIALS');
  }

  if (!user.isActive) {
    throw new AppError('Your account has been deactivated. Please contact support.', 403, 'ACCOUNT_DEACTIVATED');
  }

  let profile = null;
  if (user.role === 'worker') {
    profile = await WorkerProfile.findOne({ userId: user._id });
  } else if (user.role === 'employer') {
    profile = await EmployerProfile.findOne({ userId: user._id });
  }

  const token = generateToken(user._id, user.role);

  return new ApiResponse(res, 200, 'Login successful', {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role
    },
    profile,
    token
  });
});

export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    throw new AppError('User not found', 404, 'NOT_FOUND');
  }

  let profile = null;
  if (user.role === 'worker') {
    profile = await WorkerProfile.findOne({ userId: user._id });
  } else if (user.role === 'employer') {
    profile = await EmployerProfile.findOne({ userId: user._id });
  }

  return new ApiResponse(res, 200, 'Session retrieved', {
    user: {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role
    },
    profile
  });
});
