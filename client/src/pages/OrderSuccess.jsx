import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import API from '../services/api';
import { CheckCircle2, ShoppingBag } from 'lucide-react';

const OrderSuccess = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tranId');
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!tranId) return;
      try {
        const { data } = await API.get(`/orders/transaction/${tranId}`);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching success order details', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [tranId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-48 text-slate-400">
        <span className="font-semibold text-sm">Processing order invoice...</span>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-12 text-center shadow-lg">
        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-500 mx-auto mb-6">
          <CheckCircle2 size={40} className="fill-emerald-500 text-white" />
        </div>
        <h1 className="text-3xl font-black text-slate-800">Payment Successful!</h1>
        <p className="text-slate-500 mt-2 text-sm sm:text-base">
          Thank you for your order. Your payment was verified and processed successfully.
        </p>

        {order && (
          <div className="mt-8 border-t border-b border-slate-100 py-6 text-left space-y-4">
            <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-slate-500">
              <div>
                <span>Transaction ID</span>
                <p className="text-slate-800 font-bold mt-0.5">{order.transactionId}</p>
              </div>
              <div>
                <span>Date & Time</span>
                <p className="text-slate-800 font-bold mt-0.5">
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <span>Delivery Status</span>
                <p className="text-primary-600 font-extrabold uppercase mt-0.5 tracking-wider">
                  🚚 {order.deliveryStatus}
                </p>
              </div>
              <div>
                <span>Amount Paid</span>
                <p className="text-slate-900 font-extrabold mt-0.5 text-sm">
                  ${order.totalAmount ? order.totalAmount.toFixed(2) : '0.00'}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Items Purchased</h3>
              <div className="space-y-3">
                {order.items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between text-xs font-semibold">
                    <span className="text-slate-700 max-w-[200px] line-clamp-1">{item.title}</span>
                    <span className="text-slate-400">Qty: {item.quantity}</span>
                    <span className="text-slate-800">${((item.price || 0) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 text-xs">
              <h3 className="font-bold text-slate-500 uppercase tracking-wider mb-2 font-bold">Shipping Destination</h3>
              <p className="text-slate-700 font-medium leading-relaxed">
                {order.shippingInfo.address}, {order.shippingInfo.city}, {order.shippingInfo.postalCode}, {order.shippingInfo.country}
              </p>
              <p className="text-slate-400 mt-1">Contact: {order.shippingInfo.phone}</p>
            </div>
          </div>
        )}

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-3 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
          >
            <ShoppingBag size={16} /> Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccess;
