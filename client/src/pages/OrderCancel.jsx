import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertTriangle, ArrowLeft } from 'lucide-react';

const OrderCancel = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tranId');

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center text-amber-500 mx-auto mb-6">
        <AlertTriangle size={40} />
      </div>
      <h1 className="text-2xl font-black text-slate-800">Payment Cancelled</h1>
      <p className="text-slate-500 text-sm mt-2">
        You cancelled the payment process. No money was charged, and your order remains in pending state. Feel free to complete the checkout whenever you are ready.
      </p>

      {tranId && (
        <p className="text-xs font-semibold text-slate-400 mt-4">
          Reference Transaction ID: <span className="text-slate-600 font-bold">{tranId}</span>
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          to="/cart"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors"
        >
          View Cart & Retry
        </Link>
        <Link
          to="/"
          className="text-slate-500 hover:text-primary-600 font-bold text-sm transition-colors inline-flex items-center justify-center gap-2"
        >
          <ArrowLeft size={16} /> Back to Catalog
        </Link>
      </div>
    </div>
  );
};

export default OrderCancel;
