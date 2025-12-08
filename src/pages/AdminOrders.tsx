import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import OrdersAdmin from '@/components/admin/OrdersAdmin';
import type { Order } from '@/types/order';

const AdminOrders = () => {
  const navigate = useNavigate();
  const { isAdmin } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Redirection si pas admin
  if (!isAdmin) {
    navigate('/');
    return null;
  }

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    // Vous pouvez ouvrir un modal ou rediriger vers une page de détails
  };

  const handleDeleteOrder = (orderId: string) => {
    console.log('Ordre supprimé:', orderId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate('/admin/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Retour au tableau de bord
        </button>

        {/* Content */}
        <OrdersAdmin
          onViewOrder={handleViewOrder}
          onDeleteOrder={handleDeleteOrder}
        />

        {/* Order Details Modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-96 overflow-y-auto">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">Détails de la Commande</h2>
                  <button
                    onClick={() => setSelectedOrder(null)}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    ✕
                  </button>
                </div>
                <p className="text-lg font-semibold text-blue-600">{selectedOrder.orderNumber}</p>
              </div>

              <div className="p-6 space-y-6">
                {/* Customer Info */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Client</h3>
                  <p>{selectedOrder.shippingAddress?.firstName} {selectedOrder.shippingAddress?.lastName}</p>
                  <p className="text-sm text-gray-600">{selectedOrder.shippingAddress?.phone}</p>
                </div>

                {/* Items */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">Articles</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="text-sm text-gray-600">
                        {item.productName || item.product?.name} x {item.quantity} - €{(item.price * item.quantity).toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-blue-600">€{(selectedOrder.pricing?.total || selectedOrder.totalAmount || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-200 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Fermer
                </button>
                <button
                  onClick={() => {
                    navigate(`/orders/${selectedOrder._id}`);
                    setSelectedOrder(null);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Voir les détails complets
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;
