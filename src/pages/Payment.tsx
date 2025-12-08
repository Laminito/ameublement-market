import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { formatCurrency } from '@/utils/currency';
import { CreditCard, Wallet, CheckCircle2, ArrowLeft, AlertCircle, Loader } from 'lucide-react';
import OrderService from '@/services/orderService';
import { useCartStore } from '@/store/cartStore';
import { useAuth } from '@/contexts/AuthContext';

interface PaymentState {
  productId?: string;
  paymentMode?: 'cash' | 'credit';
  creditDuration?: 1 | 2 | 3 | 4 | 5 | 6;
  priceCash?: number;
  priceCredit?: number;
}

const Payment = () => {
  const location = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  const { isAuthenticated, user } = useAuth();
  const state = (location.state || {}) as PaymentState;

  const [orderCreating, setOrderCreating] = useState(true);
  const [orderError, setOrderError] = useState<string | null>(null);
  const orderCreatedRef = useRef(false);

  const mode = state.paymentMode || 'cash';

  // Create order on component mount
  useEffect(() => {
    // Prevent double creation in React strict mode
    if (orderCreatedRef.current) {
      return;
    }

    const createOrder = async () => {
      try {
        setOrderCreating(true);
        setOrderError(null);

        // Check authentication
        if (!isAuthenticated) {
          setOrderError('Vous devez être connecté pour créer une commande');
          return;
        }

        // Check if we have cart items
        if (!cartItems || cartItems.length === 0) {
          setOrderError('Votre panier est vide');
          return;
        }

        orderCreatedRef.current = true;

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
          paymentMethod: (mode === 'cash' ? 'card' : 'kredika') as 'kredika' | 'card' | 'transfer',
        };

        // Create order via API
        console.log('Creating order with payload:', payload);
        const result = await OrderService.createOrder(payload);
        console.log('Order created:', result);
        
        // Clear cart after successful order creation
        clearCart();
      } catch (err: any) {
        orderCreatedRef.current = false;
        console.error('Failed to create order:', err);
        let errorMsg = err instanceof Error ? err.message : 'Erreur lors de la création de la commande';
        
        // Extract stock error details if present
        if (err.message && err.message.includes('Insufficient stock')) {
          // Format: "Insufficient stock for Product Name. Available: X"
          const match = err.message.match(/Available:\s*(\d+)/);
          if (match) {
            const available = match[1];
            errorMsg = `Stock insuffisant. ${available} article(s) seulement disponible(s). Veuillez réduire la quantité.`;
          }
        }
        
        setOrderError(errorMsg);
      } finally {
        setOrderCreating(false);
      }
    };

    createOrder();
  }, [cartItems, isAuthenticated, user, mode, state.creditDuration, clearCart]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-primary-600 transition">
            <ArrowLeft size={18} className="sm:w-5 sm:h-5" />
            Continuer vos achats
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-10 max-w-3xl w-full">
        <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
          {/* Loading state */}
          {orderCreating && (
            <div className="flex flex-col items-center justify-center py-12 gap-4">
              <Loader className="animate-spin text-purple-600" size={32} />
              <p className="text-gray-600 font-medium">Création de votre commande...</p>
            </div>
          )}

          {/* Error state */}
          {orderError && !orderCreating && (
            <div className="flex flex-col items-start gap-4">
              <div className="flex items-center gap-3 w-full bg-red-50 p-4 rounded-xl border border-red-200">
                <AlertCircle className="text-red-600 flex-shrink-0" size={24} />
                <div>
                  <h3 className="font-semibold text-red-900">Erreur lors de la création</h3>
                  <p className="text-red-700 text-sm">{orderError}</p>
                </div>
              </div>
              <div className="flex gap-3 w-full">
                <Link to="/cart" className="px-5 py-3 rounded-xl bg-primary-600 text-white hover:opacity-90 font-semibold flex-1">Modifier le panier</Link>
                <Link to="/products" className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold flex-1">Retour aux produits</Link>
              </div>
            </div>
          )}

          {/* Success state */}
          {!orderCreating && !orderError && (
            <>
              <div className="flex items-center gap-3 mb-4 sm:mb-6">
                {mode === 'cash' ? (
                  <Wallet className="text-green-600" size={24} />
                ) : (
                  <CreditCard className="text-purple-600" size={24} />
                )}
                <h1 className="text-xl sm:text-2xl font-bold">
                  {mode === 'cash' ? 'Paiement Cash' : `Paiement à Crédit (${state.creditDuration || 12} mois)`}
                </h1>
              </div>

              <div className="space-y-4">
                <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-5 rounded-xl">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Montant à payer</span>
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {formatCurrency(mode === 'cash' ? (state.priceCash || 0) : (state.priceCredit || 0))}
                    </span>
                  </div>
                </div>

                {mode === 'credit' && (
                  <div className="bg-purple-50 p-5 rounded-xl">
                    <div className="font-semibold mb-2">Étapes à suivre</div>
                    <ul className="list-disc ml-6 text-gray-700 space-y-2">
                      <li>Votre demande de crédit a été pré-enregistrée.</li>
                      <li>Un conseiller vous contactera pour finaliser la validation.</li>
                      <li>Après validation, vous recevrez un calendrier des échéances.</li>
                    </ul>
                  </div>
                )}

                {mode === 'cash' && (
                  <div className="bg-green-50 p-5 rounded-xl">
                    <div className="font-semibold mb-2">Moyens de paiement</div>
                    <ul className="list-disc ml-6 text-gray-700 space-y-2">
                      <li>Mobile Money (Wave, Orange Money, Free Money)</li>
                      <li>Virement bancaire</li>
                      <li>Paiement à la livraison (espèces ou TPE)</li>
                    </ul>
                  </div>
                )}

                <div className="flex items-center gap-3 bg-blue-50 p-5 rounded-xl">
                  <CheckCircle2 className="text-blue-600" />
                  <div className="text-sm text-gray-700">
                    Votre commande est bien enregistrée. Un récapitulatif vous a été envoyé.
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Link to="/" className="px-5 py-3 rounded-xl bg-gray-100 hover:bg-gray-200 font-semibold">Retour à l'accueil</Link>
                  <Link to="/orders" className="px-5 py-3 rounded-xl bg-primary-600 text-white hover:opacity-90 font-semibold">Voir mes commandes</Link>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Payment;
