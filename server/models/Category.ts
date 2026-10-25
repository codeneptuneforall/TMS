import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: String,
  description: String,
  defaultTeamId: String,
  active: Boolean,
}, { versionKey: false });

export const Category = mongoose.model('Category', CategorySchema, 'categories');
