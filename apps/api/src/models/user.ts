import { Schema, model, Types } from 'mongoose';

export interface UserDocument {
  _id: Types.ObjectId;
  name: string;
  username: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
}

const UserSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      unique: true,
      required: true,
      sparse: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    deletedAt: {
      type: Date,
      select: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const User = model<UserDocument>('User', UserSchema);
