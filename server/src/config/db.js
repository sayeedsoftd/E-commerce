const mongoose = require('mongoose');
const Product = require('../models/Product');

const seedProducts = async () => {
  try {
    const count = await Product.countDocuments();
    if (count === 0) {
      const products = [
        {
          title: "Pro Wireless Noise Cancelling Headphones",
          category: "Electronics",
          price: 149.99,
          image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=600&q=80",
          stock: 15,
          description: "Experience premium sound with our industry-leading wireless noise cancelling headphones.",
          ratings: 4.8
        },
        {
          title: "Minimalist Leather Backpack",
          category: "Clothing",
          price: 79.99,
          image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=600&q=80",
          stock: 10,
          description: "Sleek and durable leather backpack designed for modern everyday commuting.",
          ratings: 4.5
        },
        {
          title: "Ceramic Coffee Dripper & Mug Set",
          category: "Home",
          price: 34.99,
          image: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=600&q=80",
          stock: 20,
          description: "Elegant ceramic pour-over coffee maker with matching mug for the perfect brew.",
          ratings: 4.6
        },
        {
          title: "Ultra-Lightweight Running Shoes",
          category: "Shoes",
          price: 120.00,
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80",
          stock: 3,
          description: "High-performance breathable running shoes with ultra-responsive cushioning.",
          ratings: 4.7
        },
        {
          title: "Stainless Steel Smart Water Bottle",
          category: "Sports",
          price: 45.00,
          image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=600&q=80",
          stock: 25,
          description: "Vacuum insulated water bottle with LED touch screen temperature display.",
          ratings: 4.2
        },
        {
          title: "Vintage Mechanical Wrist Watch",
          category: "Clothing",
          price: 199.99,
          image: "https://images.unsplash.com/photo-1524592094714-0f0654e20314?auto=format&fit=crop&w=600&q=80",
          stock: 4,
          description: "Classic mechanical watch featuring a skeleton dial and genuine leather strap.",
          ratings: 4.9
        }
      ];
      await Product.insertMany(products);
      console.log('Database seeded with standard catalog products.');
    }
  } catch (error) {
    console.error('Seeding products failed:', error.message);
  }
};

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/ecommerce');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await seedProducts();
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
