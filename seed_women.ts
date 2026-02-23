import mongoose from 'mongoose';
import { Category } from './src/app/modules/category/category.model';
import { Product } from './src/app/modules/product/product.model';
import { Navbar } from './src/app/modules/navbar/navbar.model';
import { slugify } from 'transliteration';

const DB_URL = 'mongodb://localhost:27017/Lumiere';

const womenCategory = {
  name: 'Women',
  subCategories: [
    { title: 'Dresses', items: ['Evening', 'Summer', 'Cocktail', 'Maxi'] },
    { title: 'Tops', items: ['Blouses', 'Knitwear', 'Tees', 'Shirts'] },
    { title: 'Skirts', items: ['Midi', 'Mini', 'Pleated', 'Pencil'] },
    { title: 'Footwear', items: ['Heels', 'Flats', 'Boots', 'Sandals'] },
  ],
  colors: [
    'Red',
    'Emerald',
    'Silk White',
    'Pink',
    'Lavender',
    'Black',
    'Champagne',
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
};

const womenImages = [
  'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1539008886845-a968600cd9cd?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1618932260643-eee4a2f652a6?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?auto=format&fit=crop&q=80&w=800',
  'https://images.unsplash.com/photo-1581067723502-4662d3ad9302?auto=format&fit=crop&q=80&w=800',
];

async function seedWomen() {
  await mongoose.connect(DB_URL);
  console.log('Connected to DB');

  // 1. Upsert Category
  await Category.findOneAndUpdate(
    { name: 'Women' },
    { ...womenCategory, isDeleted: false },
    { upsert: true, new: true },
  );
  console.log('✅ Women category updated');

  // 2. Restore/Upsert Navbar Item
  await Navbar.findOneAndUpdate(
    { title: 'Women' },
    {
      title: 'Women',
      href: '/shop?category=Women',
      order: 3, // Adjust order as needed
      isDeleted: false,
      subItems: womenCategory.subCategories.map((sub) => ({
        title: sub.title,
        items: sub.items,
      })),
    },
    { upsert: true, new: true },
  );
  console.log('✅ Women navbar item restored/updated');

  // 3. Seed Women Products
  const products: any[] = [];
  womenCategory.subCategories.forEach((sub) => {
    sub.items.forEach((type) => {
      for (let i = 1; i <= 2; i++) {
        const name = `Women's ${type} ${sub.title.slice(0, -1)} ${i}`;
        const buyPrice = parseFloat((Math.random() * 60 + 20).toFixed(2));
        const price = parseFloat(
          (buyPrice * 1.8 + Math.random() * 20).toFixed(2),
        );

        products.push({
          name,
          slug: `${slugify(name)}-${Math.random().toString(36).slice(2, 5)}`,
          category: 'Women',
          subCategory: sub.title,
          type,
          price,
          buyPrice,
          rating: Number((Math.random() * (5 - 4.2) + 4.2).toFixed(1)),
          image: womenImages[Math.floor(Math.random() * womenImages.length)],
          description: `A elegant ${type.toLowerCase()} from our latest Women's ${sub.title.toLowerCase()} collection. Designed for style and comfort.`,
          details:
            'Premium fabric, detailed stitching, and contemporary design. A must-have for any modern wardrobe.',
          colors: [
            womenCategory.colors[
              Math.floor(Math.random() * womenCategory.colors.length)
            ],
            womenCategory.colors[
              Math.floor(Math.random() * womenCategory.colors.length)
            ],
          ],
          sizes: womenCategory.sizes,
          featured: Math.random() > 0.7,
          stock: Math.floor(Math.random() * 100) + 20,
        });
      }
    });
  });

  await Product.insertMany(products);
  console.log(`✅ ${products.length} Women products seeded successfully!`);

  await mongoose.disconnect();
}

seedWomen().catch(console.error);
