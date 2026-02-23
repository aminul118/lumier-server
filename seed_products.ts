import mongoose from 'mongoose';
import { Product } from './src/app/modules/product/product.model';

const DB_URL = 'mongodb://localhost:27017/Lumiere';

const products = [
  {
    name: 'AeroGlass Premium Headphones',
    category: 'Electronics',
    subCategory: 'Audio',
    type: 'Over-Ear',
    price: 299.99,
    buyPrice: 150.0,
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    description:
      'Experience pure sound with AeroGlass wireless noise-cancelling headphones.',
    details:
      'High-fidelity audio, 40-hour battery life, active noise cancellation, and ergonomic design for all-day comfort.',
    colors: ['Black', 'Space Gray', 'Silver'],
    sizes: ['One Size'],
    featured: true,
    rating: 4.8,
    slug: 'aeroglass-premium-headphones',
    stock: 50,
  },
  {
    name: 'Minimalist Wood Desk',
    category: 'Home & Garden',
    subCategory: 'Furniture',
    type: 'Office',
    price: 450.0,
    buyPrice: 200.0,
    image:
      'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
    description:
      'Crafted from sustainable oak, this desk brings elegance to any workspace.',
    details:
      'Hand-finished surface, spacious cable management tray, and solid wood construction for lifetime durability.',
    colors: ['Natural Oak', 'Dark Walnut'],
    sizes: ['Small', 'Standard', 'Large'],
    featured: true,
    rating: 4.9,
    slug: 'minimalist-wood-desk',
    stock: 15,
  },
  {
    name: 'HydraPeak Smart Bottle',
    category: 'Health & Fitness',
    subCategory: 'Hydration',
    type: 'Accessories',
    price: 59.99,
    buyPrice: 25.0,
    image:
      'https://images.unsplash.com/photo-1602143399827-bd9596a62f77?q=80&w=1000&auto=format&fit=crop',
    description:
      'Stay hydrated with the smart bottle that tracks your water intake.',
    details:
      'Bluetooth connectivity, LED glow reminders, vacuum insulated stainless steel, and 24-hour temperature retention.',
    colors: ['Ocean Blue', 'Pure White', 'Matte Black'],
    sizes: ['24oz', '32oz'],
    featured: false,
    rating: 4.5,
    slug: 'hydrapeak-smart-bottle',
    stock: 120,
  },
  {
    name: 'Urban Explorer Backpack',
    category: 'Lifestyle',
    subCategory: 'Bags',
    type: 'Travel',
    price: 120.0,
    buyPrice: 45.0,
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1000&auto=format&fit=crop',
    description:
      'The ultimate companion for your daily adventures and weekend getaways.',
    details:
      'Water-resistant fabric, dedicated 16-inch laptop compartment, hidden security pockets, and breathable mesh back.',
    colors: ['Forest Green', 'Stealth Black', 'Navy'],
    sizes: ['20L', '28L'],
    featured: true,
    rating: 4.7,
    slug: 'urban-explorer-backpack',
    stock: 75,
  },
  {
    name: 'Lumina Smart Bulb Kit',
    category: 'Electronics',
    subCategory: 'Smart Home',
    type: 'Lighting',
    price: 89.0,
    buyPrice: 35.0,
    image:
      'https://images.unsplash.com/photo-1550985543-f47f38aeee65?q=80&w=1000&auto=format&fit=crop',
    description:
      'Transform your home with 16 million colors and adjustable white light.',
    details:
      'Voice control compatible with Alexa and Google Home, scheduling features, and energy-efficient LED technology.',
    colors: ['RGB'],
    sizes: ['3-Bulb Kit', '5-Bulb Kit'],
    featured: false,
    rating: 4.6,
    slug: 'lumina-smart-bulb-kit',
    stock: 200,
  },
];

async function seed() {
  await mongoose.connect(DB_URL);
  console.log('Connected to DB');

  // Clear existing products to avoid slug unique constraint errors if re-running
  await Product.deleteMany({ slug: { $in: products.map((p) => p.slug) } });

  const result = await Product.insertMany(products);
  console.log(`${result.length} products seeded successfully!`);

  await mongoose.disconnect();
}

seed().catch(console.error);
