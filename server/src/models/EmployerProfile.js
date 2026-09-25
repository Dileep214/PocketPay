import mongoose from 'mongoose';

const employerProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true
    },
    businessName: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true,
      maxlength: [120, 'Business name cannot exceed 120 characters']
    },
    businessType: {
      type: String,
      required: [true, 'Business type is required'],
      enum: ['Restaurant / Cafe', 'Retail / Shop', 'Delivery / Logistics', 'Events', 'Housekeeping', 'Construction', 'Other'],
      default: 'Restaurant / Cafe'
    },
    contactPerson: {
      type: String,
      trim: true,
      default: ''
    },
    address: {
      street: { type: String, default: '' },
      locality: { type: String, required: true, default: 'Madhapur' },
      city: { type: String, default: 'Hyderabad' },
      pincode: { type: String, default: '500081' }
    },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'verified', 'flagged'],
      default: 'verified' // Auto-verified for frictionless MVP
    }
  },
  {
    timestamps: true
  }
);

employerProfileSchema.index({ 'address.locality': 1, 'address.city': 1 });

export const EmployerProfile = mongoose.model('EmployerProfile', employerProfileSchema);
