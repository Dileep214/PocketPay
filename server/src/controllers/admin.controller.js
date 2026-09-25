import { User } from '../models/User.js';
import { Job } from '../models/Job.js';
import { Application } from '../models/Application.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getStats = asyncHandler(async (req, res) => {
  const [totalUsers, totalWorkers, totalEmployers, totalJobs, activeJobs, totalApplications] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'worker' }),
    User.countDocuments({ role: 'employer' }),
    Job.countDocuments(),
    Job.countDocuments({ status: 'active' }),
    Application.countDocuments()
  ]);

  return new ApiResponse(res, 200, 'Admin platform statistics', {
    totalUsers,
    totalWorkers,
    totalEmployers,
    totalJobs,
    activeJobs,
    totalApplications
  });
});

export const moderateJob = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const job = await Job.findByIdAndUpdate(id, { status }, { new: true });
  return new ApiResponse(res, 200, `Job status updated to ${status}`, job);
});

export const moderateUser = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  const user = await User.findByIdAndUpdate(id, { isActive }, { new: true });
  return new ApiResponse(res, 200, `User active status set to ${isActive}`, user);
});
