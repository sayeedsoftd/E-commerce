const connectDB = require('./src/config/db');
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const authRoutes = require('./src/routes/authRoutes');
const productRoutes = require('./src/routes/productRoutes');
const cartRoutes = require('./src/routes/cartRoutes');
const wishlistRoutes = require('./src/routes/wishlistRoutes');
const orderRoutes = require('./src/routes/orderRoutes');
const adminRoutes = require('./src/routes/adminRoutes');
const errorHandler = require('./src/middleware/errorHandler');

const User = require('./src/models/User');
const Product = require('./src/models/Product');
const Cart = require('./src/models/Cart');
const Order = require('./src/models/Order');
const Wishlist = require('./src/models/Wishlist');

// Intercept external SSLCommerz calls during tests
const originalFetch = global.fetch;
global.fetch = async function (url, options) {
  if (typeof url === 'string' && url.includes('sandbox.sslcommerz.com/gwprocess/v4/api.php')) {
    return {
      status: 200,
      json: async () => ({
        status: 'SUCCESS',
        GatewayPageURL: 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php?session_id=mock_session_123'
      })
    };
  }
  return originalFetch.apply(this, arguments);
};

const runTests = async () => {
  console.log('--- STARTING BACKEND ENDPOINT INTEGRATION TESTS ---');

  await connectDB();

  const app = express();
  app.use(express.json());
  app.use(cors());
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/cart', cartRoutes);
  app.use('/api/wishlist', wishlistRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/admin', adminRoutes);
  app.use(errorHandler);

  const PORT = 5050;
  const server = app.listen(PORT, () => {
    console.log(`Test server started on port ${PORT}`);
  });

  const BASE_URL = `http://localhost:${PORT}/api`;
  let userToken = '';
  let adminToken = '';
  let testProductId = '';

  const testUserEmail = `testuser-${Date.now()}@example.com`;
  const testAdminEmail = `testadmin-${Date.now()}@example.com`;

  try {
    console.log('\n[TEST 1] Registering standard user...');
    const registerUserRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Customer',
        email: testUserEmail,
        password: 'password123',
        role: 'user',
      }),
    });
    const registerUserData = await registerUserRes.json();
    if (registerUserRes.status !== 201 || !registerUserData.token) {
      throw new Error(`Failed User Registration. Status: ${registerUserRes.status}, Message: ${registerUserData.message}`);
    }
    userToken = registerUserData.token;
    console.log('✓ Standard user registered successfully.');

    console.log('\n[TEST 2] Registering admin user...');
    const registerAdminRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Administrator',
        email: testAdminEmail,
        password: 'password123',
        role: 'admin',
      }),
    });
    const registerAdminData = await registerAdminRes.json();
    if (registerAdminRes.status !== 201 || !registerAdminData.token) {
      throw new Error(`Failed Admin Registration. Status: ${registerAdminRes.status}, Message: ${registerAdminData.message}`);
    }
    adminToken = registerAdminData.token;
    console.log('✓ Admin user registered successfully.');

    console.log('\n[TEST 3] Fetching products catalog...');
    const getProductsRes = await fetch(`${BASE_URL}/products`);
    const products = await getProductsRes.json();
    if (getProductsRes.status !== 200 || !Array.isArray(products) || products.length === 0) {
      throw new Error(`Failed Fetching Products. Status: ${getProductsRes.status}, Response: ${JSON.stringify(products)}`);
    }
    testProductId = products[0]._id;
    console.log(`✓ Products loaded. Found ${products.length} products. Selected item: ${products[0].title}`);

    console.log('\n[TEST 4] Adding product to user cart...');
    const addCartRes = await fetch(`${BASE_URL}/cart/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        productId: testProductId,
        quantity: 2,
      }),
    });
    const cartData = await addCartRes.json();
    if (addCartRes.status !== 200 || !cartData.items || cartData.items.length === 0) {
      throw new Error(`Failed Add To Cart. Status: ${addCartRes.status}, Response: ${JSON.stringify(cartData)}`);
    }
    console.log('✓ Added item to cart. Cart total unique items:', cartData.items.length);

    console.log('\n[TEST 5] Adding product to user wishlist...');
    const addWishlistRes = await fetch(`${BASE_URL}/wishlist/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({ productId: testProductId }),
    });
    const wishlistData = await addWishlistRes.json();
    if (addWishlistRes.status !== 200 || !wishlistData.products) {
      throw new Error(`Failed Add To Wishlist. Status: ${addWishlistRes.status}, Response: ${JSON.stringify(wishlistData)}`);
    }
    console.log('✓ Added item to wishlist.');

    console.log('\n[TEST 6] Testing checkout session initiation (SSLCommerz API)...');
    const checkoutRes = await fetch(`${BASE_URL}/orders/checkout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`,
      },
      body: JSON.stringify({
        shippingInfo: {
          address: '123 Test Street',
          city: 'Dhaka',
          postalCode: '1212',
          country: 'Bangladesh',
          phone: '01712345678',
        },
        billingInfo: {
          address: '123 Test Street',
          city: 'Dhaka',
          postalCode: '1212',
          country: 'Bangladesh',
          phone: '01712345678',
        },
      }),
    });
    const checkoutData = await checkoutRes.json();
    if (checkoutRes.status !== 200 || !checkoutData.url) {
      throw new Error(`Failed Checkout. Status: ${checkoutRes.status}, Response: ${JSON.stringify(checkoutData)}`);
    }
    console.log('✓ SSLCommerz Sandbox redirection URL returned successfully:', checkoutData.url.substring(0, 70) + '...');

    console.log('\n[TEST 7] Fetching Admin Dashboard metrics...');
    const adminStatsRes = await fetch(`${BASE_URL}/admin/stats`, {
      headers: { 'Authorization': `Bearer ${adminToken}` },
    });
    const adminStatsData = await adminStatsRes.json();
    if (adminStatsRes.status !== 200 || adminStatsData.totalUsers === undefined) {
      throw new Error(`Failed Fetching Admin Stats. Status: ${adminStatsRes.status}, Response: ${JSON.stringify(adminStatsData)}`);
    }
    console.log('✓ Admin stats retrieved successfully. Total users registered:', adminStatsData.totalUsers);

    console.log('\n======================================');
    console.log('🎉 ALL BACKEND ENDPOINT TESTS PASSED SUCCESSFULLY!');
    console.log('======================================');
  } catch (error) {
    console.error('\n❌ TEST SUITE FAILED:', error.message);
    process.exitCode = 1;
  } finally {
    console.log('\nCleaning up test database documents...');
    try {
      await User.deleteMany({ email: { $in: [testUserEmail, testAdminEmail] } });
      await Cart.deleteMany({});
      await Wishlist.deleteMany({});
      await Order.deleteMany({ transactionId: { $regex: '^TXN-' } });
      console.log('Cleanup finished.');
    } catch (cleanupErr) {
      console.error('Cleanup failed:', cleanupErr.message);
    }

    server.close();
    await mongoose.connection.close();
    console.log('Server and database connection terminated. Exiting.');
    process.exit(process.exitCode || 0);
  }
};

runTests();
