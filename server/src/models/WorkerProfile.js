import mongoose from 'mongoose';

const workerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    bio: {
      type: String,
      maxlength: [250, 'Bio cannot exceed 250 characters'],
      default: ''
    },
    locality: {
      type: String,
      required: [true, 'Locality is required'],
      trim: true,
      default: 'Madhapur'
    },
    city: {
      type: String,
      default: 'Hyderabad',
      trim: true
    },
    pincode: {
      type: String,
      trim: true,
      default: '500081'
    },
    skills: {
      type: [String],
      default: []
    },
    experienceLevel: {
      type: String,
      enum: ['none', 'under_1yr', '1_to_3yrs', '3yrs_plus'],
      default: 'none'
    },
    preferredWage: {
      amount: {
        type: Number,
        default: 600
      },
      type: {
        type: String,
        enum: ['daily', 'hourly', 'monthly'],
        default: 'daily'
      }
    },
    availability: {
      immediate: {
        type: Boolean,
        default: true
      },
      shift: {
        type: String,
        enum: ['morning', 'evening', 'night', 'flexible'],
        default: 'flexible'
      }
    },
    languages: {
      type: [String],
      default: ['Telugu', 'Hindi']
    }
  },
  {
    timestamps: true
  }
);

workerProfileSchema.index({ locality: 1, city: 1 });
workerProfileSchema.index({ skills: 1 });

export const WorkerProfile = mongoose.model('WorkerProfile', workerProfileSchema);
