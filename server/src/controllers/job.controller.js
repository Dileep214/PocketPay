import { Job } from '../models/Job.js';
import { EmployerProfile } from '../models/EmployerProfile.js';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getJobs = asyncHandler(async (req, res) => {
  const {
    locality,
    category,
    wageType,
    urgency,
    search,
    page = 1,
    limit = 20
  } = req.query;

  const query = { status: 'active' };

  if (locality && locality !== 'All Localities') {
    query['location.locality'] = new RegExp(`^${locality.trim()}$`, 'i');
  }

  if (category && category !== 'All Categories') {
    query.category = category;
  }

  if (wageType && ['daily', 'hourly', 'monthly'].includes(wageType)) {
    query['wage.type'] = wageType;
  }

  if (urgency && ['immediate', 'this_week', 'flexible'].includes(urgency)) {
    query.urgency = urgency;
  }

  if (search && search.trim()) {
    const s = search.trim();
    query.$or = [
      { title: { $regex: s, $options: 'i' } },
      { businessName: { $regex: s, $options: 'i' } },
      { description: { $regex: s, $options: 'i' } },
      { 'location.locality': { $regex: s, $options: 'i' } }
    ];
  }

  const pageNum = Math.max(1, parseInt(page, 10));
  const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10)));
  const skip = (pageNum - 1) * limitNum;

  const [jobs, total] = await Promise.all([
    Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Job.countDocuments(query)
  ]);

  return new ApiResponse(res, 200, 'Jobs retrieved successfully', jobs, {
    page: pageNum,
    limit: limitNum,
    total,
    totalPages: Math.ceil(total / limitNum)
  });
});

export const getJobById = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id).populate('employerId', 'name phone');
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }
  return new ApiResponse(res, 200, 'Job retrieved successfully', job);
});

export const createJob = asyncHandler(async (req, res) => {
  const {
    title,
    category,
    description,
    vacancies = 1,
    wage,
    workTimings,
    location,
    urgency = 'immediate'
  } = req.body;

  if (!title || !category || !description || !wage || !location) {
    throw new AppError('Please fill all mandatory job fields', 400, 'MISSING_FIELDS');
  }

  // Get employer's business profile name
  let businessName = req.user.name;
  const employerProfile = await EmployerProfile.findOne({ userId: req.user.userId });
  if (employerProfile && employerProfile.businessName) {
    businessName = employerProfile.businessName;
  }

  const job = await Job.create({
    employerId: req.user.userId,
    businessName,
    title: title.trim(),
    category,
    description: description.trim(),
    vacancies: Number(vacancies) || 1,
    wage: {
      amount: Number(wage.amount) || 500,
      type: wage.type || 'daily',
      isNegotiable: Boolean(wage.isNegotiable)
    },
    workTimings: {
      shift: workTimings?.shift || 'morning',
      hoursPerDay: Number(workTimings?.hoursPerDay) || 8
    },
    location: {
      addressText: location.addressText || `${location.locality}, Hyderabad`,
      locality: location.locality || 'Madhapur',
      city: 'Hyderabad',
      pincode: location.pincode || '500081'
    },
    urgency,
    status: 'active'
  });

  return new ApiResponse(res, 201, 'Job posted successfully', job);
});

export const updateJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }

  // Check ownership
  if (job.employerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to update this job', 403, 'FORBIDDEN');
  }

  const updatedJob = await Job.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });

  return new ApiResponse(res, 200, 'Job updated successfully', updatedJob);
});

export const updateJobStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  if (!['active', 'paused', 'filled', 'expired'].includes(status)) {
    throw new AppError('Invalid status value', 400, 'INVALID_STATUS');
  }

  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }

  if (job.employerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to change status for this job', 403, 'FORBIDDEN');
  }

  job.status = status;
  await job.save();

  return new ApiResponse(res, 200, `Job status updated to ${status}`, job);
});

export const deleteJob = asyncHandler(async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }

  if (job.employerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to delete this job', 403, 'FORBIDDEN');
  }

  await Job.findByIdAndDelete(req.params.id);
  return new ApiResponse(res, 200, 'Job deleted successfully');
});

export const getEmployerJobs = asyncHandler(async (req, res) => {
  const jobs = await Job.find({ employerId: req.user.userId })
    .sort({ createdAt: -1 })
    .lean();

  return new ApiResponse(res, 200, 'Employer jobs retrieved', jobs);
});
