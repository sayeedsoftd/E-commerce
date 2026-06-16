import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { XCircle, ArrowLeft, RefreshCw } from 'lucide-react';

const OrderFail = () => {
  const [searchParams] = useSearchParams();
  const tranId = searchParams.get('tranId');

  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center text-rose-500 mx-auto mb-6">
        <XCircle size={40} />
      </div>
      <h1 className="text-2xl font-black text-slate-800">Payment Failed</h1>
      <p className="text-slate-500 text-sm mt-2">
        We were unable to process your payment for this order. This could be due to network issues, insufficient funds, or incorrect credentials.
      </p>

      {tranId && (
        <p className="text-xs font-semibold text-slate-400 mt-4">
          Reference Transaction ID: <span className="text-slate-600 font-bold">{tranId}</span>
        </p>
      )}

      <div className="mt-8 flex flex-col gap-3">
        <Link
          to="/checkout"
          className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-2.5 rounded-xl text-sm transition-colors flex items-center justify-center gap-2"
        >
          <RefreshCw size={16} /> Try Checkout Again
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

export default OrderFail;
