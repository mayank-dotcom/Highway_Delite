import mongoose from 'mongoose';

export interface IUser {
  _id: string;
  name: string;
  email: string;
  image?: string;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    image: {
      type: String,
    },
    emailVerified: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating the model multiple times
export default mongoose.models.User || mongoose.model<IUser>('User', userSchema);
