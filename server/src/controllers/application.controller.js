import { Application } from '../models/Application.js';
import { Job } from '../models/Job.js';
import { WorkerProfile } from '../models/WorkerProfile.js';
import { AppError } from '../utils/AppError.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const applyToJob = asyncHandler(async (req, res) => {
  const { jobId } = req.params;
  const { workerNote = '' } = req.body;
  const workerId = req.user.userId;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }

  if (job.status !== 'active') {
    throw new AppError('This job is no longer accepting applications', 400, 'JOB_NOT_ACTIVE');
  }

  // Prevent employer from applying to own job
  if (job.employerId.toString() === workerId) {
    throw new AppError('You cannot apply to your own job post', 400, 'CANNOT_APPLY_SELF');
  }

  // Check if already applied
  const existingApp = await Application.findOne({ jobId, workerId });
  if (existingApp) {
    throw new AppError('You have already applied to this job', 409, 'ALREADY_APPLIED');
  }

  // Create application
  const application = await Application.create({
    jobId,
    workerId,
    employerId: job.employerId,
    workerNote: workerNote.slice(0, 150),
    status: 'applied'
  });

  // Increment applicants count
  await Job.findByIdAndUpdate(jobId, { $inc: { applicantsCount: 1 } });

  return new ApiResponse(res, 201, 'Application submitted successfully', application);
});

export const getWorkerApplications = asyncHandler(async (req, res) => {
  const workerId = req.user.userId;

  const applications = await Application.find({ workerId })
    .populate({
      path: 'jobId',
      select: 'title businessName category wage workTimings location urgency status employerId',
      populate: {
        path: 'employerId',
        select: 'name phone'
      }
    })
    .sort({ createdAt: -1 })
    .lean();

  return new ApiResponse(res, 200, 'Worker applications retrieved', applications);
});

export const withdrawApplication = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const workerId = req.user.userId;

  const application = await Application.findOne({ _id: id, workerId });
  if (!application) {
    throw new AppError('Application not found', 404, 'NOT_FOUND');
  }

  await Application.findByIdAndDelete(id);
  await Job.findByIdAndUpdate(application.jobId, { $inc: { applicantsCount: -1 } });

  return new ApiResponse(res, 200, 'Application withdrawn successfully');
});

export const getJobApplications = asyncHandler(async (req, res) => {
  const { jobId } = req.params;

  const job = await Job.findById(jobId);
  if (!job) {
    throw new AppError('Job not found', 404, 'NOT_FOUND');
  }

  // Ensure only the job owner (or admin) can view applicants
  if (job.employerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to view applicants for this job', 403, 'FORBIDDEN');
  }

  const applications = await Application.find({ jobId })
    .populate('workerId', 'name phone email')
    .sort({ createdAt: -1 })
    .lean();

  // Populate worker profiles
  const workerIds = applications.map((a) => a.workerId?._id);
  const profiles = await WorkerProfile.find({ userId: { $in: workerIds } }).lean();
  const profileMap = new Map(profiles.map((p) => [p.userId.toString(), p]));

  const enrichedApplications = applications.map((app) => ({
    ...app,
    workerProfile: app.workerId ? profileMap.get(app.workerId._id.toString()) : null
  }));

  return new ApiResponse(res, 200, 'Applications retrieved', enrichedApplications);
});

export const updateApplicationStatus = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, employerNotes } = req.body;

  if (!['reviewed', 'shortlisted', 'hired', 'rejected'].includes(status)) {
    throw new AppError('Invalid application status', 400, 'INVALID_STATUS');
  }

  const application = await Application.findById(id);
  if (!application) {
    throw new AppError('Application not found', 404, 'NOT_FOUND');
  }

  // Verify ownership
  if (application.employerId.toString() !== req.user.userId && req.user.role !== 'admin') {
    throw new AppError('You are not authorized to update this candidate status', 403, 'FORBIDDEN');
  }

  application.status = status;
  if (employerNotes !== undefined) {
    application.employerNotes = employerNotes;
  }
  await application.save();

  return new ApiResponse(res, 200, `Candidate status updated to ${status}`, application);
});
