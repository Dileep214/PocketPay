import { WorkerProfile } from '../models/WorkerProfile.js';
import { EmployerProfile } from '../models/EmployerProfile.js';
import { User } from '../models/User.js';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getWorkerProfile = asyncHandler(async (req, res) => {
  const profile = await WorkerProfile.findOne({ userId: req.user.userId });
  if (!profile) {
    throw new AppError('Worker profile not found', 404, 'NOT_FOUND');
  }
  return new ApiResponse(res, 200, 'Profile retrieved', profile);
});

export const updateWorkerProfile = asyncHandler(async (req, res) => {
  const { name, bio, locality, pincode, skills, experienceLevel, preferredWage, availability, languages } = req.body;

  if (name) {
    await User.findByIdAndUpdate(req.user.userId, { name: name.trim() });
  }

  const profile = await WorkerProfile.findOneAndUpdate(
    { userId: req.user.userId },
    {
      $set: {
        ...(bio !== undefined && { bio }),
        ...(locality && { locality }),
        ...(pincode && { pincode }),
        ...(skills && { skills }),
        ...(experienceLevel && { experienceLevel }),
        ...(preferredWage && { preferredWage }),
        ...(availability && { availability }),
        ...(languages && { languages })
      }
    },
    { new: true, upsert: true, runValidators: true }
  );

  return new ApiResponse(res, 200, 'Worker profile updated successfully', profile);
});

export const getEmployerProfile = asyncHandler(async (req, res) => {
  const profile = await EmployerProfile.findOne({ userId: req.user.userId });
  if (!profile) {
    throw new AppError('Employer profile not found', 404, 'NOT_FOUND');
  }
  return new ApiResponse(res, 200, 'Employer profile retrieved', profile);
});

export const updateEmployerProfile = asyncHandler(async (req, res) => {
  const { name, businessName, businessType, contactPerson, address } = req.body;

  if (name) {
    await User.findByIdAndUpdate(req.user.userId, { name: name.trim() });
  }

  const profile = await EmployerProfile.findOneAndUpdate(
    { userId: req.user.userId },
    {
      $set: {
        ...(businessName && { businessName }),
        ...(businessType && { businessType }),
        ...(contactPerson !== undefined && { contactPerson }),
        ...(address && { address })
      }
    },
    { new: true, upsert: true, runValidators: true }
  );

  return new ApiResponse(res, 200, 'Employer profile updated successfully', profile);
});
