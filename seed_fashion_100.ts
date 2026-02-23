import mongoose from 'mongoose';
import { Product } from './src/app/modules/product/product.model';
import {
  HeroBanner,
  MiniBanner,
} from './src/app/modules/hero-banner/hero-banner.model';

const DB_URL = 'mongodb://localhost:27017/Lumiere';

// ── Category structure matching the app's category system ───────────────────
const CATALOG = [
  {
    name: 'Women',
    subCategory: 'Dresses',
    types: [
      'Midi Dress',
      'Maxi Dress',
      'Mini Dress',
      'Evening Gown',
      'Sundress',
    ],
    adjectives: [
      'Floral',
      'Elegant',
      'Vintage',
      'Bohemian',
      'Classic',
      'Chic',
      'Romantic',
      'Luxe',
    ],
    images: [
      'https://images.unsplash.com/photo-1518310383802-640c2de311b2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1502716119720-b23a93e5fe0b?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Rose', 'Ivory', 'Sage', 'Blush', 'Midnight', 'Champagne'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    name: 'Women',
    subCategory: 'Tops',
    types: ['Blouse', 'Crop Top', 'Tank Top', 'Shirt', 'Off-Shoulder Top'],
    adjectives: ['Silk', 'Cotton', 'Linen', 'Satin', 'Wrap', 'Ruched'],
    images: [
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['White', 'Black', 'Beige', 'Blush', 'Lavender', 'Sage'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    name: 'Women',
    subCategory: 'Outerwear',
    types: [
      'Trench Coat',
      'Blazer',
      'Leather Jacket',
      'Cardigan',
      'Puffer Jacket',
    ],
    adjectives: [
      'Oversized',
      'Tailored',
      'Double-Breasted',
      'Belted',
      'Cropped',
    ],
    images: [
      'https://images.unsplash.com/photo-1548624313-0396c75e4b1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1520367445093-50dc08a59d9d?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Camel', 'Black', 'Olive', 'Navy', 'Burgundy'],
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Men',
    subCategory: 'Shirts',
    types: [
      'Oxford Shirt',
      'Linen Shirt',
      'Flannel Shirt',
      'Dress Shirt',
      'Polo Shirt',
    ],
    adjectives: ['Classic', 'Slim Fit', 'Regular Fit', 'Italian', 'Casual'],
    images: [
      'https://images.unsplash.com/photo-1603252109303-2751441dd157?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1541233349642-6e425fe6190e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['White', 'Navy', 'Sky Blue', 'Charcoal', 'Slate', 'Burgundy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Men',
    subCategory: 'Trousers',
    types: ['Chino', 'Slim Jean', 'Cargo Pant', 'Dress Trouser', 'Jogger'],
    adjectives: ['Tapered', 'Straight', 'Relaxed', 'Stretch', 'Premium'],
    images: [
      'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1594938298603-c8148c4b4a47?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Black', 'Grey', 'Navy', 'Khaki', 'Olive'],
    sizes: ['28', '30', '32', '34', '36', '38'],
  },
  {
    name: 'Men',
    subCategory: 'Jackets',
    types: [
      'Bomber Jacket',
      'Denim Jacket',
      'Harrington Jacket',
      'Parka',
      'Windbreaker',
    ],
    adjectives: ['Slim', 'Oversized', 'Insulated', 'Lightweight', 'Waterproof'],
    images: [
      'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1580657018950-c7f7d1b2caf5?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Black', 'Army Green', 'Navy', 'Tan', 'Midnight Blue'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Accessories',
    subCategory: 'Bags',
    types: ['Tote Bag', 'Shoulder Bag', 'Crossbody Bag', 'Backpack', 'Clutch'],
    adjectives: ['Leather', 'Canvas', 'Vegan', 'Quilted', 'Woven'],
    images: [
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Black', 'Tan', 'White', 'Red', 'Nude'],
    sizes: ['One Size'],
  },
  {
    name: 'Accessories',
    subCategory: 'Scarves',
    types: [
      'Silk Scarf',
      'Cashmere Wrap',
      'Wool Scarf',
      'Bandana',
      'Infinity Scarf',
    ],
    adjectives: ['Printed', 'Solid', 'Checkered', 'Embroidered', 'Sheer'],
    images: [
      'https://images.unsplash.com/photo-1601924994987-69e26d50dc26?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1440761952671-e8f2f72f6ec8?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1587486913049-53fc88980cfc?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Ivory', 'Navy', 'Plum', 'Terracotta', 'Forest Green'],
    sizes: ['One Size'],
  },
  {
    name: 'Footwear',
    subCategory: 'Heels',
    types: ['Block Heel', 'Stiletto', 'Kitten Heel', 'Wedge', 'Mule'],
    adjectives: ['Suede', 'Patent', 'Strappy', 'Pointed-Toe', 'Platform'],
    images: [
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1515347619252-60a4bf4fff4f?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['Nude', 'Black', 'Red', 'White', 'Silver'],
    sizes: ['36', '37', '38', '39', '40', '41'],
  },
  {
    name: 'Footwear',
    subCategory: 'Sneakers',
    types: ['Low-Top', 'High-Top', 'Running Shoe', 'Court Shoe', 'Slip-On'],
    adjectives: ['Minimal', 'Chunky', 'Retro', 'Tech', 'Classic'],
    images: [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1499032628985-f2f7a9f90c7e?q=80&w=800&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=800&auto=format&fit=crop',
    ],
    colors: ['White', 'Black', 'Grey', 'Navy', 'Cream'],
    sizes: ['38', '39', '40', '41', '42', '43', '44', '45'],
  },
];

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function pickN<T>(arr: T[], min = 1, max = 3): T[] {
  const count = Math.floor(Math.random() * (max - min + 1)) + min;
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return [...new Set(shuffled.slice(0, count))];
}

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

function generateProducts(count: number) {
  const products = [];
  let idx = 0;

  // Distribute evenly across catalog entries
  while (products.length < count) {
    const cat = CATALOG[idx % CATALOG.length];
    idx++;

    const adj = pick(cat.adjectives);
    const type = pick(cat.types);
    const name = `${adj} ${type}`;
    const baseSlug = slugify(name);
    const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

    const buyPrice = parseFloat((Math.random() * 60 + 20).toFixed(2)); // 20–80
    const price = parseFloat(
      (buyPrice * (1.5 + Math.random() * 0.8)).toFixed(2),
    ); // 1.5–2.3x buy
    const hasSale = Math.random() > 0.55;
    const salePrice = hasSale
      ? parseFloat((price * (0.6 + Math.random() * 0.25)).toFixed(2))
      : 0;

    products.push({
      name,
      category: cat.name,
      subCategory: cat.subCategory,
      type,
      price,
      buyPrice,
      salePrice,
      image: pick(cat.images),
      images: pickN(cat.images, 1, 3),
      description: `Discover the ${name} — a standout piece in our ${cat.subCategory} collection. Crafted with attention to detail, this ${type.toLowerCase()} offers both style and comfort for modern fashion enthusiasts.`,
      details: `<p>Made from high-quality materials, the <strong>${name}</strong> is designed for everyday elegance. Whether you're heading to a casual brunch or a sophisticated evening event, this ${type.toLowerCase()} adapts seamlessly.</p><ul><li>Premium fabric blend</li><li>Comfortable fit for all-day wear</li><li>Easy care instructions</li><li>Available in multiple colours and sizes</li></ul>`,
      colors: pickN(cat.colors, 2, 4),
      sizes: pickN(cat.sizes, 2, Math.min(5, cat.sizes.length)),
      featured: Math.random() > 0.75,
      rating: parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)), // 3.5–5.0
      slug,
      stock: Math.floor(Math.random() * 150) + 5,
      soldCount: Math.floor(Math.random() * 800),
    });
  }

  return products.slice(0, count);
}

async function seed() {
  console.log('Connecting to MongoDB...');
  await mongoose.connect(DB_URL);
  console.log('✅ Connected to DB:', DB_URL);

  // ── Seed Products ─────────────────────────────────────────────────────────
  const toSeed = generateProducts(100);

  // Clear old products
  await Product.deleteMany({});
  console.log(`Inserting ${toSeed.length} products...`);
  const result = await Product.insertMany(toSeed, { ordered: false });
  console.log(`✅ ${result.length} fashion products seeded successfully!`);

  // Print a summary
  const byCategory: Record<string, number> = {};
  toSeed.forEach((p) => {
    byCategory[p.category] = (byCategory[p.category] || 0) + 1;
  });
  console.log('\n📦 Breakdown by category:');
  Object.entries(byCategory).forEach(([cat, count]) =>
    console.log(`   ${cat}: ${count} products`),
  );

  // ── Seed Hero Banners ─────────────────────────────────────────────────────
  await HeroBanner.deleteMany({});
  const heroBanners = [
    {
      image:
        'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?q=80&w=1600&auto=format&fit=crop',
      tag: 'New Collection 2026',
      title: 'Elevate Your\nSignature Style',
      subtitle: 'Up to 40% OFF on premium fashion picks. Limited time offer.',
      cta: 'Shop Now',
      ctaHref: '/shop',
      accentColor: 'from-blue-600 to-cyan-400',
      bgGlow: 'bg-blue-600/20',
      order: 0,
      isActive: true,
      isDeleted: false,
    },
    {
      image:
        'https://images.unsplash.com/photo-1469334031218-e382a71b716b?q=80&w=1600&auto=format&fit=crop',
      tag: "Women's Collection",
      title: 'Timeless Beauty,\nModern Edge',
      subtitle: "Discover our curated women's fashion for every occasion.",
      cta: 'Explore Women',
      ctaHref: '/shop?category=Women',
      accentColor: 'from-pink-500 to-rose-400',
      bgGlow: 'bg-pink-600/20',
      order: 1,
      isActive: true,
      isDeleted: false,
    },
    {
      image:
        'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1600&auto=format&fit=crop',
      tag: 'Summer Sale',
      title: 'Hot Deals,\nCooler Looks',
      subtitle: 'Shop our biggest summer sale before it ends!',
      cta: 'View Offers',
      ctaHref: '/shop?featured=true',
      accentColor: 'from-amber-500 to-orange-400',
      bgGlow: 'bg-amber-600/20',
      order: 2,
      isActive: true,
      isDeleted: false,
    },
    {
      image:
        'https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=1600&auto=format&fit=crop',
      tag: "Men's Essentials",
      title: 'Dress Sharp,\nLive Bold',
      subtitle: "Premium men's fashion — from casual to formal.",
      cta: 'Shop Men',
      ctaHref: '/shop?category=Men',
      accentColor: 'from-slate-600 to-gray-400',
      bgGlow: 'bg-slate-600/20',
      order: 3,
      isActive: true,
      isDeleted: false,
    },
  ];
  const heroBannerResult = await HeroBanner.insertMany(heroBanners);
  console.log(`\n🖼️  ${heroBannerResult.length} hero banners seeded!`);

  // ── Seed Mini Banners ─────────────────────────────────────────────────────
  await MiniBanner.deleteMany({});
  const miniBanners = [
    {
      image:
        'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop',
      label: 'Featured Picks',
      title: 'Staff Favourites',
      href: '/shop?featured=true',
      accent: 'from-purple-600/80 to-indigo-800/90',
      order: 0,
      isActive: true,
      isDeleted: false,
    },
    {
      image:
        'https://images.unsplash.com/photo-1542060748-10c28b62716f?q=80&w=800&auto=format&fit=crop',
      label: 'Best Sellers',
      title: 'Top Rated Styles',
      href: '/shop?sort=-rating',
      accent: 'from-emerald-600/80 to-teal-800/90',
      order: 1,
      isActive: true,
      isDeleted: false,
    },
  ];
  const miniBannerResult = await MiniBanner.insertMany(miniBanners);
  console.log(`🖼️  ${miniBannerResult.length} mini banners seeded!`);

  await mongoose.disconnect();
  console.log('\n✅ Done! Seeding complete.');
}

seed().catch((err) => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
