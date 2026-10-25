import assert from 'node:assert/strict';
import mongoose from 'mongoose';
import request from 'supertest';
import { createApp } from './app';
import { seedIfEmpty } from './seed';

async function main() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ticket_management');
  await seedIfEmpty();
  const app = createApp();

  const health = await request(app).get('/api/health');
  assert.equal(health.status, 200);
  assert.equal(health.body.ok, true);

  const users = await request(app).get('/api/users');
  assert.equal(users.status, 200);
  assert.ok(Array.isArray(users.body));
  assert.ok(users.body.length > 0);

  await mongoose.disconnect();
  console.log('API smoke tests passed');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});