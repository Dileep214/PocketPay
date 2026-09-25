import mongoose from 'mongoose';

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: true,
      index: true
    },
    workerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    status: {
      type: String,
      enum: ['applied', 'reviewed', 'shortlisted', 'hired', 'rejected', 'withdrawn'],
      default: 'applied',
      index: true
    },
    workerNote: {
      type: String,
      maxlength: [150, 'Note cannot exceed 150 characters'],
      default: ''
    },
    employerNotes: {
      type: String,
      default: ''
    }
  },
  {
    timestamps: true
  }
);

// Enforce unique application per worker per job
applicationSchema.index({ jobId: 1, workerId: 1 }, { unique: true });
applicationSchema.index({ workerId: 1, createdAt: -1 });
applicationSchema.index({ employerId: 1, status: 1 });

export const Application = mongoose.model('Application', applicationSchema);
