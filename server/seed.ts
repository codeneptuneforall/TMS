import mongoose from 'mongoose';
import { users } from '../src/data/users';
import { teams } from '../src/data/teams';
import { categories } from '../src/data/categories';
import { tickets } from '../src/data/tickets';
import { notifications } from '../src/data/notifications';

export async function seedIfEmpty() {
  const { User } = await import('./models/User');
  const { Team } = await import('./models/Team');
  const { Category } = await import('./models/Category');
  const { Ticket } = await import('./models/Ticket');
  const { Notification } = await import('./models/Notification');

  async function seed(Model: any, data: any[]) {
    if ((await Model.countDocuments()) === 0) {
      await Model.collection.drop().catch(() => {});
      if (data.length) await Model.insertMany(data.map((x: any) => ({ ...x })));
    } else {
      // backfill missing records without resetting existing data
      for (const item of data) {
        await Model.updateOne({ id: item.id }, { $set: item }, { upsert: true });
      }
    }
  }

  await seed(User, users);
  await seed(Team, teams);
  await seed(Category, categories);
  await seed(Ticket, tickets);
  await seed(Notification, notifications);
  console.log('Seed check complete');
}
