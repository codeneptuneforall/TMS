import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { createApp } from './app';
import { seedIfEmpty } from './seed';

dotenv.config();

const app = createApp();
const PORT = process.env.PORT || 4000;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ticket_management';

async function main() {
  await mongoose.connect(MONGODB_URI);
  console.log('MongoDB connected');
  await seedIfEmpty();
  app.listen(PORT, () => console.log(`API server running on http://localhost:${PORT}`));
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
