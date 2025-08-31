import mongoose from 'mongoose';

export interface INote {
  _id: string;
  title: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

const noteSchema = new mongoose.Schema<INote>(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
      index: true, // Index for faster queries by user
    },
  },
  {
    timestamps: true,
  }
);

// Prevent mongoose from creating the model multiple times
export default mongoose.models.Note || mongoose.model<INote>('Note', noteSchema);

