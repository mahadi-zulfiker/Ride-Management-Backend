import { Schema, model } from 'mongoose';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  phone: { type: String },
  emergencyContact: { type: String },
  role: { type: String, enum: ['admin', 'rider', 'driver'], required: true },
  isBlocked: { type: Boolean, default: false },
  vehicleInfo: {
    type: { type: String },
    licensePlate: { type: String }
  },
  isApproved: { type: Boolean, default: true },
  isOnline: { type: Boolean, default: false }
});

export default model('User', userSchema);