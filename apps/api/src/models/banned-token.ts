import { Schema, model } from 'mongoose';

const BannedTokenSchema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    bannedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
  },
);

export const BannedToken = model('BannedToken', BannedTokenSchema);
