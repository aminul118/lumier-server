import mongoose from 'mongoose';
import { Color } from '../app/modules/color/color.model';

const DB_URL = 'mongodb://localhost:27017/Lumiere';

const colors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Silk White', hex: '#F9F9F9' },
  { name: 'Emerald', hex: '#50C878' },
  { name: 'Pink', hex: '#FFC0CB' },
  { name: 'Lavender', hex: '#E6E6FA' },
  { name: 'Champagne', hex: '#F7E7CE' },
  { name: 'Red', hex: '#FF0000' },
  { name: 'Blue', hex: '#0000FF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Gold', hex: '#FFD700' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Dark Gray', hex: '#A9A9A9' },
];

async function seedColors() {
  try {
    await mongoose.connect(DB_URL);
    console.log('Connected to DB');

    for (const color of colors) {
      await Color.findOneAndUpdate(
        { name: color.name },
        { ...color, isDeleted: false },
        { upsert: true, new: true },
      );
    }

    console.log('✅ Colors seeded successfully!');
  } catch (error) {
    console.error('❌ Error seeding colors:', error);
  } finally {
    await mongoose.disconnect();
  }
}

seedColors();
