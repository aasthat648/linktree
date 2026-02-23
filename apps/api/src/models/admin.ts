import { Schema, model } from 'mongoose';

const AdminSchema = new Schema(
  {
    name: String,
    email: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['SUPER_ADMIN', 'SUPPORT'],
      default: 'SUPPORT',
    },
    deletedAt: Date,
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const Admin = model('Admin', AdminSchema);
