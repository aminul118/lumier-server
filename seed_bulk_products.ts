import mongoose from 'mongoose';
import { Product } from './src/app/modules/product/product.model';

const DB_URL = 'mongodb://localhost:27017/Lumiere';

const categories = [
  {
    name: 'Electronics',
    sub: ['Smartphones', 'Laptops', 'Audio', 'Wearables'],
    prefix: ['Ultra', 'Neo', 'Pro', 'Aero', 'Quantum'],
  },
  {
    name: 'Fashion',
    sub: ['Men', 'Women', 'Accessories', 'Footwear'],
    prefix: ['Urban', 'Elite', 'Vogue', 'Classic', 'Lunar'],
  },
  {
    name: 'Home & Living',
    sub: ['Furniture', 'Decor', 'Kitchen', 'Bedding'],
    prefix: ['Nordic', 'Majestic', 'Zen', 'Elegance', 'Eco'],
  },
  {
    name: 'Sports',
    sub: ['Fitness', 'Outdoor', 'Cycling', 'Team Sports'],
    prefix: ['Apex', 'Velocity', 'Titan', 'Sprint', 'Enduro'],
  },
  {
    name: 'Beauty',
    sub: ['Skincare', 'Makeup', 'Fragrance', 'Haircare'],
    prefix: ['Radiant', 'Pure', 'Glow', 'Essence', 'Velvet'],
  },
];

const types = [
  'Premium',
  'Essential',
  'Limited Edition',
  'Professional',
  'Standard',
];
const colors = [
  'Midnight Black',
  'Pearl White',
  'Crimson Red',
  'Navy Blue',
  'Forest Green',
  'Space Gray',
  'Rose Gold',
];
const sizes = ['S', 'M', 'L', 'XL', 'Standard', 'One Size'];

const images: Record<string, string[]> = {
  Electronics: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1000&auto=format&fit=crop',
  ],
  Fashion: [
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1509042239860-f550ce710b93?q=80&w=1000&auto=format&fit=crop',
  ],
  'Home & Living': [
    'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583847268964-b28dc2f51f92?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1616489953149-8078dbb40340?q=80&w=1000&auto=format&fit=crop',
  ],
  Sports: [
    'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?q=80&w=1000&auto=format&fit=crop',
  ],
  Beauty: [
    'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=1000&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1596462502278-27bfdc4033c8?q=80&w=1000&auto=format&fit=crop',
  ],
};

function generateProducts(count: number) {
  const generated = [];
  for (let i = 0; i < count; i++) {
    const cat = categories[Math.floor(Math.random() * categories.length)];
    const subCat = cat.sub[Math.floor(Math.random() * cat.sub.length)];
    const prefix = cat.prefix[Math.floor(Math.random() * cat.prefix.length)];
    const type = types[Math.floor(Math.random() * types.length)];

    const productName = `${prefix} ${subCat.slice(0, -1) || subCat} ${type} v${i + 1}`;
    const slug = productName
      .toLowerCase()
      .replace(/ /g, '-')
      .replace(/[^a-z0-9-]/g, '');

    const buyPrice = parseFloat((Math.random() * 200 + 20).toFixed(2));
    const price = parseFloat((buyPrice * 1.5 + Math.random() * 50).toFixed(2));

    const catImages = images[cat.name] || images['Electronics'];
    const image = catImages[Math.floor(Math.random() * catImages.length)];

    generated.push({
      name: productName,
      category: cat.name,
      subCategory: subCat,
      type: type,
      price: price,
      buyPrice: buyPrice,
      image: image,
      description: `A high-performance ${productName} designed for modern lifestyles. Features state-of-the-art durability and premium materials.`,
      details:
        'Built with premium components, this product offers unmatched reliability and style. Includes a 1-year limited warranty and priority customer support.',
      colors: colors.slice(0, Math.floor(Math.random() * 3) + 1),
      sizes: sizes.slice(0, Math.floor(Math.random() * 3) + 1),
      featured: Math.random() > 0.8,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
      slug: `${slug}-${Math.random().toString(36).slice(2, 7)}`,
      stock: Math.floor(Math.random() * 200) + 10,
    });
  }
  return generated;
}

async function seed() {
  await mongoose.connect(DB_URL);
  console.log('Connected to DB');

  // Optional: Clear existing "bulk-seeded" products by looking at prefix if needed,
  // but here we'll just insert 100 new ones.
  const productsToSeed = generateProducts(100);

  const result = await Product.insertMany(productsToSeed);
  console.log(`${result.length} bulk products seeded successfully!`);

  await mongoose.disconnect();
}

seed().catch(console.error);
