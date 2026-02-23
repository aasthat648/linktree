import { Schema, model, Types } from 'mongoose';

const ContactFormSchema = new Schema(
  {
    name: String,
    email: String,
    content: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      default: false,
    },

    responder: {
      type: Types.ObjectId,
      ref: 'Admin',
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

export const ContactForm = model('ContactForm', ContactFormSchema);
