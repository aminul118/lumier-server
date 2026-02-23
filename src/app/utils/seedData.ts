import { Category } from '../modules/category/category.model';
import { Product } from '../modules/product/product.model';
import { Navbar } from '../modules/navbar/navbar.model';

const categoriesData = [
  {
    name: 'Men',
    subCategories: [
      { title: 'Shirts', items: ['Formal', 'Casual', 'Oversized'] },
      { title: 'Pants', items: ['Denim', 'Chinos', 'Cargo'] },
      { title: 'Blazers', items: ['Velvet', 'Wool', 'Linen'] },
    ],
    colors: ['Black', 'Blue', 'White', 'Beige', 'Navy'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
  },
  {
    name: 'Women',
    subCategories: [
      { title: 'Dresses', items: ['Evening', 'Summer', 'Cocktail'] },
      { title: 'Tops', items: ['Blouses', 'Knitwear', 'Tees'] },
      { title: 'Skirts', items: ['Midi', 'Mini', 'Pleated'] },
    ],
    colors: ['Red', 'Emerald', 'Silk White', 'Pink', 'Lavender'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
  },
  {
    name: 'Accessories',
    subCategories: [
      { title: 'Watches', items: ['Classic', 'Sport', 'Luxury'] },
      { title: 'Bags', items: ['Handbags', 'Backpacks', 'Clutches'] },
      { title: 'Jewelry', items: ['Necklaces', 'Bracelets', 'Rings'] },
    ],
    colors: ['Gold', 'Silver', 'Rose Gold', 'Black'],
    sizes: ['One Size'],
  },
];

const images = {
  Men: [
    'https://images.unsplash.com/photo-1594932224456-806c95465ec3?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1505022610485-0249ba5b3675?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1617137968427-85924c800a22?auto=format&fit=crop&q=80&w=800',
  ],
  Women: [
    'https://images.unsplash.com/photo-1566174053879-31528523f8ae?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1539008886845-a968600cd9cd?auto=format&fit=crop&q=80&w=800',
  ],
  Accessories: [
    'https://images.unsplash.com/photo-1524592091214-8f97ad3fe019?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1548036627-14e4b51a896d?auto=format&fit=crop&q=80&w=800',
    'https://images.unsplash.com/photo-1511499767390-903390e6fbc4?auto=format&fit=crop&q=80&w=800',
  ],
};

const seedData = async () => {
  try {
    // Clear existing data
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Navbar.deleteMany({});

    console.log('🗑️ Existing data cleared');

    // Seed Categories
    await Category.insertMany(categoriesData);
    console.log('✅ Categories seeded');

    // Seed Navbar
    const navbarItems = [
      {
        title: 'Home',
        href: '/',
        order: 1,
      },
      ...categoriesData.map((cat, index) => ({
        title: cat.name,
        href: `/shop?category=${cat.name}`,
        order: index + 2,
        subItems: cat.subCategories.map((sub) => ({
          title: sub.title,
          items: sub.items,
        })),
      })),
      {
        title: 'Shop',
        href: '/shop',
        order: 5,
      },
      {
        title: 'Blogs',
        href: '/blogs',
        order: 6,
      },
    ];
    await Navbar.insertMany(navbarItems);
    console.log('✅ Navbar seeded');

    // Seed Products
    const products: any[] = [];
    categoriesData.forEach((cat) => {
      cat.subCategories.forEach((sub) => {
        sub.items.forEach((type) => {
          for (let i = 1; i <= 4; i++) {
            const catImg = images[cat.name as keyof typeof images];
            products.push({
              name: `${type} ${sub.title.slice(0, -1)} ${i}`,
              category: cat.name,
              subCategory: sub.title,
              type,
              price: Math.floor(Math.random() * (500 - 50 + 1) + 50),
              rating: Number((Math.random() * (5 - 4) + 4).toFixed(1)),
              image: catImg[i % catImg.length],
              description: `A premium ${type.toLowerCase()} ${sub.title.toLowerCase()} designed for maximum comfort and style.`,
              details: [
                'High-quality sustainable materials',
                'Expertly crafted for a perfect fit',
                'Limited edition collection',
                'Easy care and durable',
              ],
              colors: [
                cat.colors[i % cat.colors.length],
                cat.colors[(i + 1) % cat.colors.length],
              ],
              sizes: cat.sizes,
              featured: Math.random() > 0.8,
            });
          }
        });
      });
    });

    await Product.insertMany(products);
    console.log(`✅ ${products.length} Products seeded`);
  } catch (error) {
    console.error('❌ Error seeding data:', error);
  }
};

export default seedData;
