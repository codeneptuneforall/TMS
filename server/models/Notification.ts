import mongoose from 'mongoose';

const NotificationSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  recipientId: String,
  kind: String,
  title: String,
  body: String,
  ticketId: String,
  actorId: String,
  createdAt: String,
  read: Boolean,
}, { versionKey: false });

export const Notification = mongoose.model('Notification', NotificationSchema, 'notifications');
