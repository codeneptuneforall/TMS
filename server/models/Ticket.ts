import mongoose from 'mongoose';

const AttachmentSchema = new mongoose.Schema({
  id: String,
  name: String,
  size: Number,
  mime: String,
}, { _id: false });

const MessageSchema = new mongoose.Schema({
  id: String,
  authorId: String,
  visibility: String,
  body: String,
  createdAt: String,
  attachments: [AttachmentSchema],
}, { _id: false });

const ActivitySchema = new mongoose.Schema({
  id: String,
  kind: String,
  actorId: String,
  createdAt: String,
  from: mongoose.Schema.Types.Mixed,
  to: mongoose.Schema.Types.Mixed,
}, { _id: false });

const EscalationSchema = new mongoose.Schema({
  id: String,
  reason: String,
  description: String,
  escalatedBy: String,
  teamLeaderId: String,
  state: String,
  createdAt: String,
  updatedAt: String,
  resolvedAt: String,
  returnInstructions: String,
}, { _id: false });

const TicketSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  subject: String,
  description: String,
  requesterId: String,
  assigneeId: String,
  teamId: String,
  categoryId: String,
  priority: String,
  status: String,
  pendingReason: String,
  createdAt: String,
  updatedAt: String,
  dueAt: String,
  tags: [String],
  attachments: [AttachmentSchema],
  messages: [MessageSchema],
  activity: [ActivitySchema],
  escalation: EscalationSchema,
}, { versionKey: false });

export const Ticket = mongoose.model('Ticket', TicketSchema, 'tickets');
