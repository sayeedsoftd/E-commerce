const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

const initiatePayment = async (req, res, next) => {
  try {
    const { shippingInfo, billingInfo } = req.body;

    if (!shippingInfo || !billingInfo) {
      return res.status(400).json({ message: 'Shipping and billing info are required' });
    }

    const cart = await Cart.findOne({ userId: req.user._id }).populate('items.productId');
    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    let subtotal = 0;
    const items = cart.items.map(item => {
      const p = item.productId;
      const amount = p.price * item.quantity;
      subtotal += amount;
      return {
        productId: p._id,
        title: p.title,
        price: p.price,
        quantity: item.quantity,
        image: p.image,
      };
    });

    const taxAmount = Number((subtotal * 0.15).toFixed(2));
    const deliveryCharge = subtotal > 100 ? 0 : 15;
    const totalAmount = Number((subtotal + taxAmount + deliveryCharge).toFixed(2));

    const tran_id = `TXN-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const order = new Order({
      userId: req.user._id,
      items,
      shippingInfo,
      billingInfo,
      totalAmount,
      taxAmount,
      deliveryCharge,
      paymentStatus: 'pending',
      deliveryStatus: 'pending',
      transactionId: tran_id,
    });

    await order.save();

    const store_id = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'testbox';
    const is_sandbox = process.env.SSLCOMMERZ_IS_SANDBOX === 'true';

    const sslcommerz_url = is_sandbox
      ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
      : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

    const params = new URLSearchParams();
    params.append('store_id', store_id);
    params.append('store_passwd', store_passwd);
    params.append('total_amount', totalAmount.toString());
    params.append('currency', 'BDT');
    params.append('tran_id', tran_id);
    params.append('success_url', `${process.env.SERVER_URL}/api/orders/payment/success?tranId=${tran_id}`);
    params.append('fail_url', `${process.env.SERVER_URL}/api/orders/payment/fail?tranId=${tran_id}`);
    params.append('cancel_url', `${process.env.SERVER_URL}/api/orders/payment/cancel?tranId=${tran_id}`);
    params.append('ipn_url', `${process.env.SERVER_URL}/api/orders/payment/ipn`);
    params.append('cus_name', req.user.name);
    params.append('cus_email', req.user.email);
    params.append('cus_add1', shippingInfo.address);
    params.append('cus_city', shippingInfo.city);
    params.append('cus_state', shippingInfo.city);
    params.append('cus_postcode', shippingInfo.postalCode);
    params.append('cus_country', shippingInfo.country);
    params.append('cus_phone', shippingInfo.phone);
    params.append('shipping_method', 'NO');
    params.append('product_name', items.map(i => i.title).join(', ').substring(0, 100));
    params.append('product_category', 'Retail');
    params.append('product_profile', 'general');

    const response = await fetch(sslcommerz_url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: params.toString(),
    });

    const data = await response.json();

    if (data.status === 'SUCCESS' && data.GatewayPageURL) {
      return res.json({ url: data.GatewayPageURL });
    } else {
      console.error('SSLCommerz Session Error:', data);
      return res.status(500).json({ message: 'Failed to initiate payment session', details: data });
    }
  } catch (error) {
    next(error);
  }
};

const paymentSuccess = async (req, res, next) => {
  try {
    const { tranId } = req.query;
    const sslcommerz_payload = req.body;

    const val_id = sslcommerz_payload.val_id;
    const store_id = process.env.SSLCOMMERZ_STORE_ID || 'testbox';
    const store_passwd = process.env.SSLCOMMERZ_STORE_PASSWORD || 'testbox';
    const is_sandbox = process.env.SSLCOMMERZ_IS_SANDBOX === 'true';

    let is_valid = true;

    if (val_id) {
      const validation_url = is_sandbox
        ? `https://sandbox.sslcommerz.com/validator/api/valid.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`
        : `https://securepay.sslcommerz.com/validator/api/valid.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&format=json`;

      const response = await fetch(validation_url);
      const validation_data = await response.json();

      if (validation_data.status === 'VALID' || validation_data.status === 'VALIDATED') {
        is_valid = true;
      } else {
        console.warn('Payment validation failed status:', validation_data.status);
      }
    }

    if (is_valid) {
      const order = await Order.findOne({ transactionId: tranId });
      if (order) {
        order.paymentStatus = 'paid';
        order.paymentDetails = sslcommerz_payload;
        await order.save();

        for (const item of order.items) {
          await Product.findByIdAndUpdate(item.productId, {
            $inc: { stock: -item.quantity }
          });
        }

        await Cart.findOneAndUpdate({ userId: order.userId }, { items: [] });

        return res.redirect(`${process.env.CLIENT_URL}/checkout/success?tranId=${tranId}`);
      } else {
        return res.status(404).send('Order not found');
      }
    } else {
      return res.redirect(`${process.env.CLIENT_URL}/checkout/fail?tranId=${tranId}`);
    }
  } catch (error) {
    next(error);
  }
};

const paymentFail = async (req, res, next) => {
  try {
    const { tranId } = req.query;
    const order = await Order.findOne({ transactionId: tranId });
    if (order) {
      order.paymentStatus = 'failed';
      order.paymentDetails = req.body;
      await order.save();
    }
    return res.redirect(`${process.env.CLIENT_URL}/checkout/fail?tranId=${tranId}`);
  } catch (error) {
    next(error);
  }
};

const paymentCancel = async (req, res, next) => {
  try {
    const { tranId } = req.query;
    const order = await Order.findOne({ transactionId: tranId });
    if (order) {
      order.paymentStatus = 'cancelled';
      order.paymentDetails = req.body;
      await order.save();
    }
    return res.redirect(`${process.env.CLIENT_URL}/checkout/cancel?tranId=${tranId}`);
  } catch (error) {
    next(error);
  }
};

const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return res.json(orders);
  } catch (error) {
    next(error);
  }
};

const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    return res.json(order);
  } catch (error) {
    next(error);
  }
};

const getOrderByTranId = async (req, res, next) => {
  try {
    const order = await Order.findOne({ transactionId: req.params.tranId });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    if (order.userId.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }
    return res.json(order);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getMyOrders,
  getOrderById,
  getOrderByTranId,
};
