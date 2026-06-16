import React, { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import API from '../services/api';
import { Loader2, CreditCard } from 'lucide-react';

const Checkout = () => {
  const {
    cart,
    getSubtotal,
    getTax,
    getDeliveryCharge,
    getTotal,
  } = useCart();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  const [shipping, setShipping] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const [billingSame, setBillingSame] = useState(true);

  const [billing, setBilling] = useState({
    address: '',
    city: '',
    postalCode: '',
    country: '',
    phone: '',
  });

  const handleShippingChange = (e) => {
    const { name, value } = e.target;
    setShipping((prev) => ({ ...prev, [name]: value }));
  };

  const handleBillingChange = (e) => {
    const { name, value } = e.target;
    setBilling((prev) => ({ ...prev, [name]: value }));
  };

  const handlePay = async (e) => {
    e.preventDefault();
    if (
      !shipping.address ||
      !shipping.city ||
      !shipping.postalCode ||
      !shipping.country ||
      !shipping.phone
    ) {
      addToast('Please complete shipping form fields', 'warning');
      return;
    }

    if (
      !billingSame &&
      (!billing.address ||
        !billing.city ||
        !billing.postalCode ||
        !billing.country ||
        !billing.phone)
    ) {
      addToast('Please complete billing form fields', 'warning');
      return;
    }

    setLoading(true);
    try {
      const billingInfo = billingSame ? shipping : billing;
      const { data } = await API.post('/orders/checkout', {
        shippingInfo: shipping,
        billingInfo,
      });

      if (data.url) {
        addToast('Redirecting to SSLCommerz payment page...', 'success');
        window.location.href = data.url;
      } else {
        addToast('Failed to initiate payment transaction', 'error');
      }
    } catch (error) {
      console.error(error);
      addToast(error.response?.data?.message || 'Error processing checkout', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="max-w-md mx-auto py-24 text-center">
        <h2 className="text-xl font-bold text-slate-800">No items to checkout</h2>
        <a href="/" className="inline-block mt-4 bg-primary-600 hover:bg-primary-700 text-white font-bold px-6 py-2 rounded-xl text-sm">
          Return to Catalog
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-8">Checkout</h1>

      <form onSubmit={handlePay} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
            <h2 className="font-extrabold text-slate-800 text-lg border-b border-slate-100 pb-4 font-bold">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  required
                  value={shipping.address}
                  onChange={handleShippingChange}
                  placeholder="Street address, Apartment, Suite..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  required
                  value={shipping.city}
                  onChange={handleShippingChange}
                  placeholder="Dhaka, Chittagong..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  name="postalCode"
                  required
                  value={shipping.postalCode}
                  onChange={handleShippingChange}
                  placeholder="1212"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Country
                </label>
                <input
                  type="text"
                  name="country"
                  required
                  value={shipping.country}
                  onChange={handleShippingChange}
                  placeholder="Bangladesh"
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Phone Number
                </label>
                <input
                  type="text"
                  name="phone"
                  required
                  value={shipping.phone}
                  onChange={handleShippingChange}
                  placeholder="+880 17..."
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="billingSame"
                checked={billingSame}
                onChange={() => setBillingSame(!billingSame)}
                className="w-4 h-4 text-primary-600 border-slate-200 rounded focus:ring-primary-500"
              />
              <label htmlFor="billingSame" className="font-bold text-slate-700 text-sm select-none font-bold">
                Billing address is the same as shipping address
              </label>
            </div>

            {!billingSame && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-100">
                <h3 className="sm:col-span-2 font-bold text-slate-800 text-base font-bold">
                  Billing Information
                </h3>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={billing.address}
                    onChange={handleBillingChange}
                    placeholder="Street address..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={billing.city}
                    onChange={handleBillingChange}
                    placeholder="City..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Postal Code
                  </label>
                  <input
                    type="text"
                    name="postalCode"
                    required
                    value={billing.postalCode}
                    onChange={handleBillingChange}
                    placeholder="Postal Code..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Country
                  </label>
                  <input
                    type="text"
                    name="country"
                    required
                    value={billing.country}
                    onChange={handleBillingChange}
                    placeholder="Country..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Phone Number
                  </label>
                  <input
                    type="text"
                    name="phone"
                    required
                    value={billing.phone}
                    onChange={handleBillingChange}
                    placeholder="Phone number..."
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-primary-500 transition-colors"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 h-fit">
          <h2 className="font-black text-slate-800 text-lg border-b border-slate-100 pb-4 font-bold">
            Items & Breakdown
          </h2>

          <div className="mt-6 space-y-4 max-h-[220px] overflow-y-auto custom-scrollbar pr-2">
            {cart.items.map((item) => {
              const p = item.productId;
              if (!p) return null;
              return (
                <div key={item._id || p._id} className="flex gap-3 items-center justify-between text-xs">
                  <div className="flex gap-2 items-center">
                    <img
                      src={p.image}
                      alt={p.title}
                      className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 flex-shrink-0"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                    <div>
                      <span className="font-bold text-slate-700 block line-clamp-1 max-w-[150px]">{p.title}</span>
                      <span className="text-slate-400 font-semibold">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-bold text-slate-900">${((p.price || 0) * item.quantity).toFixed(2)}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-slate-100 space-y-3 text-xs font-semibold text-slate-500">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="text-slate-800">${getSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (15% VAT)</span>
              <span className="text-slate-800">${getTax().toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span className="text-slate-800">
                {getDeliveryCharge() === 0 ? 'FREE' : `$${getDeliveryCharge().toFixed(2)}`}
              </span>
            </div>
            <div className="border-t border-slate-100 pt-3 mt-3 flex justify-between items-baseline">
              <span className="text-slate-800 font-bold text-sm">Payable Amount</span>
              <span className="text-xl font-black text-slate-900">${getTotal().toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-8 bg-primary-600 hover:bg-primary-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-md shadow-primary-100 flex items-center justify-center gap-2"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={18} />
            ) : (
              <>
                <CreditCard size={18} />
                Pay via SSLCommerz
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
