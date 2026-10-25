import mongoose from 'mongoose';

describe('minimal', () => {
  it('connects', async () => {
    await mongoose.connect('mongodb://127.0.0.1:27017/ticket_management');
    console.log('connected in test');
    await mongoose.disconnect();
  }, 30000);
});