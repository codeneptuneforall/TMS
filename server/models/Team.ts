import mongoose from 'mongoose';

const TeamSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  description: String,
  leadId: String,
  memberIds: [String],
  active: Boolean,
  createdAt: String,
}, { versionKey: false });

export const Team = mongoose.model('Team', TeamSchema, 'teams');
