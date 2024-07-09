// src/models/OTP.ts

import mongoose, { Document, Schema } from "mongoose";

export interface OTPDocument extends Document {
  email: string;
  otp: string;
  createdAt: Date;
}

const otpSchema: Schema<OTPDocument> = new Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 300 },
});

const OTP = mongoose.model<OTPDocument>("OTP", otpSchema);

export default OTP;
