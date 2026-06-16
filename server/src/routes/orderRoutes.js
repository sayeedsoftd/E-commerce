const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  paymentSuccess,
  paymentFail,
  paymentCancel,
  getMyOrders,
  getOrderById,
  getOrderByTranId,
} = require('../controllers/orderController');
const { protect } = require('../middleware/auth');

router.post('/payment/success', paymentSuccess);
router.post('/payment/fail', paymentFail);
router.post('/payment/cancel', paymentCancel);

router.use(protect);
router.post('/checkout', initiatePayment);
router.get('/myorders', getMyOrders);
router.get('/:id', getOrderById);
router.get('/transaction/:tranId', getOrderByTranId);

module.exports = router;
