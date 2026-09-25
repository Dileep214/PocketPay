import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    employerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true
    },
    businessName: {
      type: String,
      required: true,
      trim: true
    },
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: [
        'Hospitality',
        'Retail',
        'Delivery',
        'Warehouse',
        'Housekeeping',
        'Events',
        'General Labor',
        'Other'
      ],
      default: 'Hospitality',
      index: true
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      maxlength: [1000, 'Description cannot exceed 1000 characters']
    },
    vacancies: {
      type: Number,
      required: true,
      min: [1, 'At least 1 vacancy required'],
      default: 1
    },
    wage: {
      amount: {
        type: Number,
        required: [true, 'Wage amount is required'],
        min: [0, 'Wage amount cannot be negative']
      },
      type: {
        type: String,
        enum: ['daily', 'hourly', 'monthly'],
        default: 'daily'
      },
      isNegotiable: {
        type: Boolean,
        default: false
      }
    },
    workTimings: {
      shift: {
        type: String,
        enum: ['morning', 'evening', 'night', 'flexible'],
        default: 'morning'
      },
      hoursPerDay: {
        type: Number,
        default: 8
      }
    },
    location: {
      addressText: {
        type: String,
        required: [true, 'Address is required']
      },
      locality: {
        type: String,
        required: [true, 'Locality is required'],
        trim: true,
        index: true
      },
      city: {
        type: String,
        default: 'Hyderabad',
        trim: true,
        index: true
      },
      pincode: {
        type: String,
        trim: true,
        default: '500081'
      }
    },
    urgency: {
      type: String,
      enum: ['immediate', 'this_week', 'flexible'],
      default: 'immediate',
      index: true
    },
    status: {
      type: String,
      enum: ['active', 'paused', 'filled', 'expired'],
      default: 'active',
      index: true
    },
    applicantsCount: {
      type: Number,
      default: 0
    },
    expiresAt: {
      type: Date,
      default: () => new Date(+new Date() + 14 * 24 * 60 * 60 * 1000) // 14 days default
    }
  },
  {
    timestamps: true
  }
);

// High-speed compound feed index
jobSchema.index({ status: 1, category: 1, createdAt: -1 });
jobSchema.index({ status: 1, 'location.locality': 1, createdAt: -1 });
jobSchema.index({ employerId: 1, status: 1, createdAt: -1 });

export const Job = mongoose.model('Job', jobSchema);
