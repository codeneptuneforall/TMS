import { Router, Request, Response } from 'express';
import { User } from './models/User';
import { Team } from './models/Team';
import { Category } from './models/Category';
import { Ticket } from './models/Ticket';
import { Notification } from './models/Notification';

const router = Router();

function clean(doc: any) {
  if (!doc) return doc;
  const obj = typeof doc.toObject === 'function' ? doc.toObject() : { ...doc };
  if (obj._id) { obj.id = obj.id ?? String(obj._id); delete obj._id; }
  delete obj.__v;
  return obj;
}

// Health
router.get('/health', (_req, res) => res.json({ ok: true }));

// Users
router.get('/users', async (_req, res) => {
  const docs = await User.find().lean();
  res.json(docs.map(clean));
});
router.get('/users/:id', async (req, res) => {
  const doc = await User.findOne({ id: req.params.id }).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(clean(doc));
});
router.post('/auth/signin', async (req, res) => {
  const { email } = req.body || {};
  const doc = await User.findOne({ email: new RegExp(`^${email}$`, 'i') }).lean();
  if (!doc) return res.status(404).json({ error: 'No account found' });
  res.json(clean(doc));
});
router.put('/users/:id', async (req, res) => {
  const payload = { ...req.body, id: req.params.id };
  const doc = await User.findOneAndUpdate({ id: req.params.id }, payload, { upsert: true, new: true }).lean();
  // sync teams membership
  const user = clean(doc);
  const teams = await Team.find().lean();
  for (const t of teams) {
    const shouldBe = (user.teamIds || []).includes(t.id);
    const isMember = (t.memberIds || []).includes(user.id);
    if (shouldBe && !isMember) await Team.updateOne({ id: t.id }, { $push: { memberIds: user.id } });
    if (!shouldBe && isMember) await Team.updateOne({ id: t.id }, { $pull: { memberIds: user.id } });
  }
  res.json(user);
});

// Teams
router.get('/teams', async (_req, res) => {
  const docs = await Team.find().lean();
  res.json(docs.map(clean));
});
router.put('/teams/:id', async (req, res) => {
  const payload = { ...req.body, id: req.params.id };
  const doc = await Team.findOneAndUpdate({ id: req.params.id }, payload, { upsert: true, new: true }).lean();
  const team = clean(doc);
  // sync users
  const users = await User.find().lean();
  for (const u of users) {
    const shouldBe = (team.memberIds || []).includes(u.id);
    const is = (u.teamIds || []).includes(team.id);
    if (shouldBe && !is) await User.updateOne({ id: u.id }, { $push: { teamIds: team.id } });
    if (!shouldBe && is) await User.updateOne({ id: u.id }, { $pull: { teamIds: team.id } });
  }
  res.json(team);
});

// Categories
router.get('/categories', async (_req, res) => {
  const docs = await Category.find().lean();
  res.json(docs.map(clean));
});
router.put('/categories', async (req, res) => {
  const list = req.body || [];
  await Category.deleteMany({});
  if (Array.isArray(list) && list.length) await Category.insertMany(list.map((c: any) => ({ ...c })));
  const docs = await Category.find().lean();
  res.json(docs.map(clean));
});

// Tickets
router.get('/tickets', async (_req, res) => {
  const docs = await Ticket.find().lean();
  res.json(docs.map(clean));
});
router.get('/tickets/:id', async (req, res) => {
  const doc = await Ticket.findOne({ id: req.params.id }).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(clean(doc));
});
router.post('/tickets', async (req, res) => {
  const input = req.body || {};
  const maxNumber = (await Ticket.find().lean()).reduce((m: number, t: any) => Math.max(m, Number(String(t.id).replace('TKT-', ''))), 0);
  const id = `TKT-${String(maxNumber + 1).padStart(6, '0')}`;
  const now = new Date().toISOString();
  const ticket = {
    id,
    subject: String(input.subject || '').trim(),
    description: String(input.description || '').trim(),
    requesterId: input.requesterId,
    assigneeId: input.assigneeId ?? null,
    teamId: input.teamId ?? null,
    categoryId: input.categoryId,
    priority: input.priority,
    status: 'open',
    createdAt: now,
    updatedAt: now,
    dueAt: null,
    tags: [],
    attachments: input.attachments || [],
    messages: [],
    activity: input.assigneeId ? [{ id: `a-${Date.now()}`, kind: 'assigned', actorId: input.requesterId, createdAt: now, from: null, to: input.assigneeId }] : [],
  };
  // sla dueAt
  const slaHours: Record<string, number> = { low: 72, medium: 48, high: 24, urgent: 8 };
  if (slaHours[input.priority]) {
    const due = new Date(Date.now() + slaHours[input.priority] * 3600000).toISOString();
    ticket.dueAt = due;
  }
  const doc = await Ticket.create(ticket);
  res.status(201).json(clean(doc));
});

// Generic patch for simple fields
router.patch('/tickets/:id', async (req, res) => {
  const doc = await Ticket.findOneAndUpdate({ id: req.params.id }, req.body || {}, { new: true }).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(clean(doc));
});

router.patch('/tickets/:id/status', async (req, res) => {
  const { status, note, pendingReason, actorId } = req.body || {};
  const t = await Ticket.findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.status !== status) {
    const now = new Date().toISOString();
    const kind = status === 'resolved' ? 'resolved' : status === 'closed' ? 'closed' : 'status';
    if (note?.trim()) {
      t.messages.push({ id: `m-${Date.now()}`, authorId: actorId, visibility: 'public', body: note.trim(), createdAt: now, attachments: [] } as any);
    }
    t.activity.push({ id: `a-${Date.now()}`, kind, actorId, createdAt: now, from: t.status, to: status } as any);
    t.status = status;
    t.pendingReason = status === 'pending' ? (pendingReason ?? 'requester') : undefined;
    t.updatedAt = now;
    if (note?.trim()) {}
    await t.save();
  }
  res.json(clean(t));
});

router.patch('/tickets/:id/priority', async (req, res) => {
  const { priority, actorId } = req.body || {};
  const t = await Ticket.findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Not found' });
  if (t.priority !== priority) {
    const now = new Date().toISOString();
    t.activity.push({ id: `a-${Date.now()}`, kind: 'priority', actorId, createdAt: now, from: t.priority, to: priority } as any);
    t.priority = priority;
    t.updatedAt = now;
    await t.save();
  }
  res.json(clean(t));
});

router.patch('/tickets/:id/assign', async (req, res) => {
  const { assigneeId, teamId, actorId } = req.body || {};
  const t = await Ticket.findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Not found' });
  const now = new Date().toISOString();
  if (teamId !== undefined && teamId !== t.teamId) {
    t.activity.push({ id: `a-${Date.now()}`, kind: 'team', actorId, createdAt: now, from: t.teamId, to: teamId } as any);
    t.teamId = teamId;
  }
  if (assigneeId !== t.assigneeId) {
    t.activity.push({ id: `a-${Date.now() + 1}`, kind: 'assigned', actorId, createdAt: now, from: t.assigneeId, to: assigneeId } as any);
    t.assigneeId = assigneeId;
  }
  t.updatedAt = now;
  await t.save();
  res.json(clean(t));
});

router.patch('/tickets/:id/team', async (req, res) => {
  const { teamId, actorId } = req.body || {};
  const t = await Ticket.findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Not found' });
  const team = await Team.findOne({ id: teamId }).lean();
  const now = new Date().toISOString();
  if (t.teamId !== teamId) {
    t.activity.push({ id: `a-${Date.now()}`, kind: 'team', actorId, createdAt: now, from: t.teamId, to: teamId } as any);
    t.teamId = teamId;
    const keepAssignee = t.assigneeId && (team?.memberIds || []).includes(t.assigneeId);
    if (!keepAssignee && t.assigneeId) {
      t.activity.push({ id: `a-${Date.now() + 1}`, kind: 'assigned', actorId, createdAt: now, from: t.assigneeId, to: null } as any);
      t.assigneeId = null;
    }
    t.updatedAt = now;
    await t.save();
  }
  res.json(clean(t));
});

router.patch('/tickets/:id/details', async (req, res) => {
  const { subject, categoryId, tags, actorId } = req.body || {};
  const t = await Ticket.findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Not found' });
  const now = new Date().toISOString();
  if (subject && subject !== t.subject) {
    t.activity.push({ id: `a-${Date.now()}`, kind: 'edited', actorId, createdAt: now, from: t.subject, to: subject } as any);
    t.subject = subject;
  }
  if (categoryId) t.categoryId = categoryId;
  if (tags) t.tags = tags;
  t.updatedAt = now;
  await t.save();
  res.json(clean(t));
});

router.post('/tickets/:id/messages', async (req, res) => {
  const { body, visibility, attachments, actorId, requesterId } = req.body || {};
  const t = await Ticket.findOne({ id: req.params.id });
  if (!t) return res.status(404).json({ error: 'Not found' });
  const now = new Date().toISOString();
  const message = { id: `m-${Date.now()}`, authorId: actorId, visibility, body, createdAt: now, attachments: attachments || [] };
  t.messages.push(message as any);
  t.activity.push({ id: `a-${Date.now()}`, kind: visibility === 'internal' ? 'note' : 'reply', actorId, createdAt: now, from: null, to: null } as any);
  // requester reply logic
  let status = t.status;
  let pendingReason = t.pendingReason;
  if (actorId === requesterId) {
    if (t.status === 'pending' || t.status === 'resolved') {
      const newStatus = t.status === 'resolved' ? 'open' : (t.assigneeId ? 'in_progress' : 'open');
      t.activity.push({ id: `a-${Date.now() + 1}`, kind: t.status === 'resolved' ? 'reopened' : 'status', actorId, createdAt: now, from: t.status, to: newStatus } as any);
      status = newStatus;
      pendingReason = undefined;
    }
  }
  t.status = status;
  t.pendingReason = pendingReason;
  t.updatedAt = now;
  await t.save();
  res.status(201).json({ ok: true, data: message, ticket: clean(t) });
});

// Notifications
router.get('/notifications', async (req, res) => {
  const recipientId = req.query.recipientId as string;
  const filter: any = recipientId ? { recipientId } : {};
  const docs = await Notification.find(filter).lean();
  res.json(docs.map(clean).sort((a: any, b: any) => String(b.createdAt).localeCompare(String(a.createdAt))));
});
router.patch('/notifications/:id/read', async (req, res) => {
  const doc = await Notification.findOneAndUpdate({ id: req.params.id }, { read: true }, { new: true }).lean();
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(clean(doc));
});
router.patch('/notifications/read-all', async (req, res) => {
  const recipientId = req.query.recipientId as string;
  await Notification.updateMany({ recipientId }, { read: true });
  res.json({ ok: true });
});

export default router;
