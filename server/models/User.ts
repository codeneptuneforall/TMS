import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  email: String,
  role: String,
  teamIds: [String],
  status: String,
  title: String,
  organization: String,
  createdAt: String,
  lastActiveAt: String,
}, { versionKey: false });

export const User = mongoose.model('User', UserSchema, 'users');
