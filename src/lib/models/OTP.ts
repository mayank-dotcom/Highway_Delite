import mongoose from 'mongoose';

export interface IOTP {
  _id: string;
  email: string;
  otp: string;
  expiresAt: Date;
  createdAt: Date;
}

const otpSchema = new mongoose.Schema<IOTP>(
  {
    email: {
      type: String,
      required: true,
      index: true,
    },
    otp: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // TTL index to automatically delete expired OTPs
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating the model multiple times
export default mongoose.models.OTP || mongoose.model<IOTP>('OTP', otpSchema);
