import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingCart, AlertCircle, Truck } from 'lucide-react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CheckoutData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  postalCode: string;
  paymentMethod: 'kredika' | 'card';
  installments?: 3 | 6 | 12 | 24;
}

export default function Checkout() {
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [checkoutData, setCheckoutData] = useState<CheckoutData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    postalCode: '',
    paymentMethod: 'kredika',
  });
  const [installmentOptions, setInstallmentOptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [step, setStep] = useState<'cart' | 'shipping' | 'payment' | 'review'>('cart');

  useEffect(() => {
    // Charger le panier du localStorage
    const cart = localStorage.getItem('cart');
    if (cart) {
      setCartItems(JSON.parse(cart));
    }

    // Charger les données utilisateur
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      setCheckoutData(prev => ({
        ...prev,
        firstName: userData.firstName || '',
        lastName: userData.lastName || '',
        email: userData.email || '',
        phone: userData.phone || '',
      }));
    }
  }, []);

  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.2;
  const total = subtotal + shipping + tax;

  const fetchInstallmentOptions = async () => {
    try {
      const response = await fetch(`/api/orders/kredika/installments?amount=${total}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const data = await response.json();
      setInstallmentOptions(data.data || []);
    } catch (err) {
      console.error('Failed to fetch installment options', err);
    }
  };

  useEffect(() => {
    if (checkoutData.paymentMethod === 'kredika') {
      fetchInstallmentOptions();
    }
  }, [checkoutData.paymentMethod, total]);

  const handleCheckoutChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setCheckoutData(prev => ({
      ...prev,
      [name]: name === 'installments' ? parseInt(value) : value,
    }));
  };

  const handleSubmitOrder = async () => {
    setError('');
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: cartItems.map(item => ({
            productId: item.id,
            quantity: item.quantity,
          })),
          shippingAddress: {
            firstName: checkoutData.firstName,
            lastName: checkoutData.lastName,
            street: checkoutData.street,
            city: checkoutData.city,
            postalCode: checkoutData.postalCode,
            phone: checkoutData.phone,
          },
          paymentMethod: checkoutData.paymentMethod,
          installments: checkoutData.installments,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to create order');
      }

      // Vider le panier
      localStorage.removeItem('cart');

      // Rediriger vers la page de paiement Kredika si nécessaire
      if (checkoutData.paymentMethod === 'kredika' && data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        navigate(`/orders/${data.order._id}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  if (cartItems.length === 0 && step === 'cart') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h1>
          <button
            onClick={() => navigate('/products')}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition mt-4"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Progress Steps */}
        <div className="flex justify-between mb-12">
          {['cart', 'shipping', 'payment', 'review'].map((s, idx) => (
            <div key={s} className="flex-1 flex items-center">
              <div className={`flex items-center justify-center w-10 h-10 rounded-full font-bold ${
                step === s
                  ? 'bg-purple-600 text-white'
                  : ['cart', 'shipping', 'payment'].includes(s)
                  ? 'bg-gray-300 text-gray-600'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {idx + 1}
              </div>
              <div className={`flex-1 h-1 mx-2 ${
                idx < 3 && (step === 'review' || (step === 'payment' && idx < 2) || (step === 'shipping' && idx < 1))
                  ? 'bg-purple-600'
                  : 'bg-gray-300'
              }`}></div>
            </div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Cart Step */}
            {step === 'cart' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Order</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      {item.image && (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-24 h-24 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-gray-600">€{item.price.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">€{(item.price * item.quantity).toFixed(2)}</p>
                        <p className="text-sm text-gray-600">x{item.quantity}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => setStep('shipping')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition"
                >
                  Continue to Shipping
                </button>
              </div>
            )}

            {/* Shipping Step */}
            {step === 'shipping' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Shipping Address</h2>

                <div className="grid sm:grid-cols-2 gap-4 mb-6">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={checkoutData.firstName}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={checkoutData.lastName}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={checkoutData.email}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 sm:col-span-2"
                  />
                  <input
                    type="tel"
                    name="phone"
                    placeholder="Phone"
                    value={checkoutData.phone}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 sm:col-span-2"
                  />
                  <input
                    type="text"
                    name="street"
                    placeholder="Street Address"
                    value={checkoutData.street}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 sm:col-span-2"
                  />
                  <input
                    type="text"
                    name="city"
                    placeholder="City"
                    value={checkoutData.city}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <input
                    type="text"
                    name="postalCode"
                    placeholder="Postal Code"
                    value={checkoutData.postalCode}
                    onChange={handleCheckoutChange}
                    className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('cart')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}

            {/* Payment Step */}
            {step === 'payment' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Method</h2>

                <div className="space-y-4 mb-6">
                  <label className="flex items-center p-4 border-2 rounded-lg cursor-pointer hover:bg-gray-50 transition" style={{ borderColor: checkoutData.paymentMethod === 'kredika' ? '#9333ea' : '#d1d5db' }}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="kredika"
                      checked={checkoutData.paymentMethod === 'kredika'}
                      onChange={handleCheckoutChange}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Kredika Payment Plan</p>
                      <p className="text-sm text-gray-600">Pay in monthly installments</p>
                    </div>
                  </label>

                  {checkoutData.paymentMethod === 'kredika' && (
                    <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mt-4">
                      <label className="block text-sm font-medium text-gray-700 mb-3">
                        Select Installment Plan
                      </label>
                      <select
                        name="installments"
                        value={checkoutData.installments || ''}
                        onChange={handleCheckoutChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                      >
                        <option value="">Choose a plan...</option>
                        {installmentOptions.map((option) => (
                          <option key={option.months} value={option.months}>
                            {option.months} months - €{option.monthlyPayment.toFixed(2)}/month
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="card"
                      checked={checkoutData.paymentMethod === 'card'}
                      onChange={handleCheckoutChange}
                      className="w-5 h-5"
                    />
                    <div className="ml-4">
                      <p className="font-semibold text-gray-900">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Pay now with your card</p>
                    </div>
                  </label>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('shipping')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep('review')}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition"
                  >
                    Review Order
                  </button>
                </div>
              </div>
            )}

            {/* Review Step */}
            {step === 'review' && (
              <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Order</h2>

                {error && (
                  <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                )}

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipping To</p>
                    <p className="font-semibold text-gray-900">
                      {checkoutData.firstName} {checkoutData.lastName}
                    </p>
                    <p className="text-gray-700">{checkoutData.street}</p>
                    <p className="text-gray-700">{checkoutData.postalCode} {checkoutData.city}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 mb-1">Payment Method</p>
                    <p className="font-semibold text-gray-900 capitalize">
                      {checkoutData.paymentMethod}
                      {checkoutData.installments && ` (${checkoutData.installments} months)`}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep('payment')}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSubmitOrder}
                    disabled={isLoading}
                    className="flex-1 px-6 py-3 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-70"
                  >
                    {isLoading ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Order Summary</h3>

              <div className="space-y-3 text-sm border-b border-gray-200 pb-4 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">€{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">{shipping === 0 ? 'Free' : `€${shipping.toFixed(2)}`}</span>
                </div>
                {shipping === 0 && (
                  <p className="text-xs text-green-600 flex items-center gap-1">
                    <Truck className="w-4 h-4" /> Free shipping applied!
                  </p>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (20%)</span>
                  <span className="font-medium">€{tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between text-lg font-bold text-gray-900 mb-6">
                <span>Total</span>
                <span className="text-purple-600">€{total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => navigate('/products')}
                className="w-full px-4 py-2 text-purple-600 text-sm font-medium hover:bg-purple-50 rounded-lg transition"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
