import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatCurrency } from '@/utils/currency';
import { getImageUrl } from '@/utils/imageUrl';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';
import OrderService from '@/services/orderService';
import { ArrowLeft, Trash2, Loader, AlertCircle, CheckCircle2, CreditCard, Wallet } from 'lucide-react';

const Cart = () => {
  const cartItems = useCartStore((state) => state.items);
  const removeItem = useCartStore((state) => state.removeItem);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const clearCart = useCartStore((state) => state.clearCart);
  const { isAuthenticated, user } = useAuth();

  const [paymentMode, setPaymentMode] = useState<'cash' | 'credit'>('cash');
  const [creditDuration, setCreditDuration] = useState<1 | 2 | 3 | 4 | 5 | 6>(3);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);
  const [orderError, setOrderError] = useState<string | null>(null);
  const [orderSuccess, setOrderSuccess] = useState(false);

  const totalPrice = cartItems.reduce(
    (total, item) => total + ((item.product.discountPrice || item.product.price) * item.quantity),
    0
  );

  const handleCreateOrder = async () => {
    try {
      setIsCreatingOrder(true);
      setOrderError(null);

      if (!isAuthenticated) {
        setOrderError('Vous devez être connecté pour créer une commande');
        return;
      }

      if (cartItems.length === 0) {
        setOrderError('Votre panier est vide');
        return;
      }

      // Prepare order payload with real user data
      const firstName = user?.firstName || user?.name?.split(' ')[0] || 'Client';
      const lastName = user?.lastName || user?.name?.split(' ')[1] || 'Default';
      const phone = user?.phone || user?.shippingAddress?.phone || '00000000';
      const city = user?.city || user?.shippingAddress?.city || 'Non spécifiée';
      const street = user?.street || user?.shippingAddress?.street || 'Non spécifiée';
      const postalCode = user?.postalCode || user?.shippingAddress?.postalCode || '00000';
      const country = user?.country || user?.shippingAddress?.country || 'Senegal';

      const payload = {
        items: cartItems.map((item: any) => ({
          productId: item.product?.id || item.product?._id || item.id,
          quantity: item.quantity,
        })),
        shippingAddress: {
          firstName,
          lastName,
          street,
          city,
          postalCode,
          country,
          phone,
        },
        paymentMethod: (paymentMode === 'cash' ? 'card' : 'kredika') as 'kredika' | 'card' | 'transfer',
      };

      console.log('Creating order with payload:', payload);
      const result = await OrderService.createOrder(payload);
      console.log('Order created:', result);

      // Clear cart and show success
      clearCart();
      setOrderSuccess(true);

      // Redirect to orders page after 2 seconds
      setTimeout(() => {
        window.location.href = '/orders';
      }, 2000);
    } catch (err: any) {
      console.error('Failed to create order:', err);
      let errorMsg = err instanceof Error ? err.message : 'Erreur lors de la création de la commande';

      // Extract stock error details if present
      if (err.message && err.message.includes('Insufficient stock')) {
        const match = err.message.match(/Available:\s*(\d+)/);
        if (match) {
          const available = match[1];
          errorMsg = `Stock insuffisant. ${available} article(s) seulement disponible(s). Veuillez réduire la quantité.`;
        }
      }

      setOrderError(errorMsg);
    } finally {
      setIsCreatingOrder(false);
    }
  };

  if (orderSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
        <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center gap-6">
          <CheckCircle2 className="text-green-600" size={64} />
          <h1 className="text-4xl font-bold text-center">Commande créée avec succès!</h1>
          <p className="text-gray-600 text-center text-lg">Redirection vers vos commandes...</p>
          <Link to="/orders" className="px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:opacity-90">
            Voir mes commandes
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={18} />
            Continuer vos achats
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 max-w-5xl w-full">
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">Mon Panier</h1>

        {cartItems.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center">
            <p className="text-gray-600 text-lg mb-6">Votre panier est vide</p>
            <Link to="/products" className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white rounded-xl font-semibold hover:opacity-90">
              <ArrowLeft size={20} />
              Retour aux produits
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.product.id} className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 flex gap-4 sm:gap-6">
                  <img
                    src={getImageUrl(item.product.images?.[0] || '/placeholder-image.png')}
                    alt={item.product.name}
                    className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-xl flex-shrink-0"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold mb-2">{item.product.name}</h3>
                      <p className="text-gray-600 text-sm mb-2">{item.product.brand}</p>
                      <p className="text-2xl font-bold text-primary-600">{formatCurrency(item.product.price)}</p>
                    </div>
                    <div className="flex items-center gap-3 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.product.id, Math.max(1, item.quantity - 1))}
                          className="w-8 h-8 rounded border border-gray-300 hover:border-primary-600 font-bold text-sm"
                        >
                          −
                        </button>
                        <span className="w-8 text-center font-bold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 rounded border border-gray-300 hover:border-primary-600 font-bold text-sm"
                        >
                          +
                        </button>
                      </div>
                      <button
                        onClick={() => removeItem(item.product.id)}
                        className="ml-auto px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-600 text-sm mb-2">Sous-total</p>
                    <p className="text-2xl font-bold">{formatCurrency((item.product.discountPrice || item.product.price) * item.quantity)}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl shadow-lg p-6 space-y-6 sticky top-4">
                <h2 className="text-2xl font-bold">Résumé</h2>

                <div className="space-y-3 border-b pb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold">{formatCurrency(totalPrice)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Livraison</span>
                    <span className="font-semibold text-green-600">Gratuite</span>
                  </div>
                </div>

                <div className="flex justify-between text-xl font-bold">
                  <span>Total</span>
                  <span className="bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">{formatCurrency(totalPrice)}</span>
                </div>

                {/* Payment Mode Selection */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold mb-3">Mode de paiement</h3>
                  <div className="space-y-2">
                    <button
                      onClick={() => setPaymentMode('cash')}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left font-semibold flex items-center gap-2 ${
                        paymentMode === 'cash'
                          ? 'border-green-500 bg-green-50 text-green-700'
                          : 'border-gray-300 hover:border-green-300'
                      }`}
                    >
                      <Wallet size={20} />
                      Paiement Cash
                    </button>
                    <button
                      onClick={() => setPaymentMode('credit')}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left font-semibold flex items-center gap-2 ${
                        paymentMode === 'credit'
                          ? 'border-purple-500 bg-purple-50 text-purple-700'
                          : 'border-gray-300 hover:border-purple-300'
                      }`}
                    >
                      <CreditCard size={20} />
                      Paiement à crédit
                    </button>
                  </div>
                </div>

                {paymentMode === 'credit' && (
                  <div className="bg-purple-50 p-4 rounded-xl">
                    <h4 className="font-semibold mb-3">Durée du crédit</h4>
                    <div className="grid grid-cols-3 gap-2">
                      {([1, 2, 3, 4, 5, 6] as const).map((duration) => (
                        <button
                          key={duration}
                          onClick={() => setCreditDuration(duration)}
                          className={`py-2 rounded-lg font-semibold transition-all ${
                            creditDuration === duration
                              ? 'bg-purple-600 text-white'
                              : 'bg-white text-gray-700 hover:bg-purple-100'
                          }`}
                        >
                          {duration}M
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {orderError && (
                  <div className="flex gap-3 bg-red-50 p-4 rounded-xl border border-red-200">
                    <AlertCircle className="text-red-600 flex-shrink-0" size={20} />
                    <div>
                      <h4 className="font-semibold text-red-900">Erreur</h4>
                      <p className="text-red-700 text-sm">{orderError}</p>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleCreateOrder}
                  disabled={isCreatingOrder || cartItems.length === 0}
                  className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isCreatingOrder ? (
                    <>
                      <Loader className="animate-spin" size={20} />
                      Création en cours...
                    </>
                  ) : (
                    'Valider la commande'
                  )}
                </button>

                <Link
                  to="/products"
                  className="w-full py-3 px-6 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold text-center transition"
                >
                  Continuer vos achats
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
