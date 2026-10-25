import express from 'express';
import cors from 'cors';
import api from './api';

export function createApp() {
  const app = express();
  app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }));
  app.use(express.json({ limit: '10mb' }));
  app.use('/api', api);
  return app;
}
