import { Link } from 'react-router-dom';
import { mockOrders } from '@/data/mockOrders';
import { formatCurrency } from '@/utils/currency';
import { 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  Wallet,
  MapPin,
  Calendar,
  ArrowRight,
  XCircle
} from 'lucide-react';
import type { OrderStatus, PaymentStatus } from '@/types/order';

const Orders = () => {
  const getStatusBadge = (status: OrderStatus) => {
    const badges = {
      PENDING: { label: 'En attente', color: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200', icon: Clock },
      PROCESSING: { label: 'En cours', color: 'bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-800 border border-blue-200', icon: Package },
      IN_TRANSIT: { label: 'En transit', color: 'bg-gradient-to-r from-purple-100 to-pink-100 text-purple-800 border border-purple-200', icon: Truck },
      OUT_FOR_DELIVERY: { label: 'En livraison', color: 'bg-gradient-to-r from-orange-100 to-amber-100 text-orange-800 border border-orange-200', icon: Truck },
      DELIVERED: { label: 'Livré', color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200', icon: CheckCircle2 },
      CANCELLED: { label: 'Annulé', color: 'bg-gradient-to-r from-red-100 to-pink-100 text-red-800 border border-red-200', icon: XCircle },
    };
    return badges[status];
  };

  const getPaymentStatusBadge = (status: PaymentStatus) => {
    const badges = {
      PENDING: { label: 'En attente', color: 'bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 border border-gray-200' },
      PAID: { label: 'Payé', color: 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-800 border border-green-200' },
      PARTIALLY_PAID: { label: 'Partiellement payé', color: 'bg-gradient-to-r from-yellow-100 to-amber-100 text-yellow-800 border border-yellow-200' },
      FAILED: { label: 'Échoué', color: 'bg-gradient-to-r from-red-100 to-rose-100 text-red-800 border border-red-200' },
    };
    return badges[status];
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Mes Commandes
          </h1>
          <p className="text-gray-600">
            Suivez l'état de vos commandes et gérez vos livraisons
          </p>
        </div>

        {/* Orders List */}
        {mockOrders.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-gray-100">
            <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Package size={40} className="text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Aucune commande</h2>
            <p className="text-gray-600 mb-6">
              Vous n'avez pas encore passé de commande
            </p>
            <Link
              to="/products"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all"
            >
              Découvrir nos produits
              <ArrowRight size={20} />
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {mockOrders.map((order) => {
              const statusBadge = getStatusBadge(order.status);
              const paymentBadge = getPaymentStatusBadge(order.paymentStatus);
              const StatusIcon = statusBadge.icon;

              return (
                <div
                  key={order.id}
                  className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 border border-gray-100"
                >
                  {/* Order Header */}
                  <div className="bg-gradient-to-r from-blue-50 via-purple-50 to-pink-50 p-6 border-b border-purple-100">\n                    <div className="flex flex-wrap justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 ${statusBadge.color}`}>
                            <StatusIcon size={16} />
                            {statusBadge.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Calendar size={16} />
                            Commandé le {formatDate(order.createdAt)}
                          </span>
                          {order.trackingNumber && (
                            <span className="font-mono bg-white px-2 py-1 rounded">
                              {order.trackingNumber}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {formatCurrency(order.totalAmount)}
                        </div>
                        <div className="flex items-center gap-2 justify-end mt-1">
                          {order.paymentMethod === 'CASH' ? (
                            <Wallet size={16} className="text-green-600" />
                          ) : (
                            <CreditCard size={16} className="text-purple-600" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${paymentBadge.color}`}>
                            {paymentBadge.label}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="p-6">
                    <div className="space-y-4 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex gap-4">
                          <img
                            src={item.image}
                            alt={item.productName}
                            className="w-20 h-20 object-cover rounded-lg"
                          />
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{item.productName}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                              <span>Quantité: {item.quantity}</span>
                              <span className="font-semibold text-gray-900">
                                {formatCurrency(item.price)}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Delivery Info */}
                    {order.deliveryDate && (
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-4 border border-blue-100">
                        <div className="flex items-start gap-3">
                          <MapPin className="text-blue-600 flex-shrink-0 mt-1" size={20} />
                          <div className="flex-1">
                            <div className="font-semibold text-gray-900 mb-1">Adresse de livraison</div>
                            <div className="text-sm text-gray-700">
                              {order.deliveryAddress.street}<br />
                              {order.deliveryAddress.city}, {order.deliveryAddress.region}<br />
                              {order.deliveryAddress.country}
                            </div>
                            <div className="mt-2 text-sm">
                              <span className="font-semibold">Livraison prévue: </span>
                              {formatDate(order.deliveryDate)}
                              {order.deliveryTime && ` (${order.deliveryTime})`}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Order Summary */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Sous-total</div>
                        <div className="font-semibold text-blue-900">{formatCurrency(order.subtotal)}</div>
                      </div>
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Livraison</div>
                        <div className="font-semibold text-purple-900">{formatCurrency(order.deliveryFee)}</div>
                      </div>
                      {order.assemblyFee > 0 && (
                        <div className="bg-gradient-to-br from-orange-50 to-amber-50 p-3 rounded-lg">
                          <div className="text-sm text-gray-600">Montage</div>
                          <div className="font-semibold text-orange-900">{formatCurrency(order.assemblyFee)}</div>
                        </div>
                      )}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-3 rounded-lg">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="font-bold text-lg text-green-900">{formatCurrency(order.totalAmount)}</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-3 mt-6">
                      {order.trackingNumber && (
                        <Link
                          to={`/orders/${order.id}/tracking`}
                          className="flex-1 bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white py-2 px-4 rounded-lg font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all text-center"
                        >
                          Suivre ma commande
                        </Link>
                      )}
                      <Link
                        to={`/orders/${order.id}`}
                        className="flex-1 bg-gradient-to-r from-gray-100 to-slate-100 text-gray-800 py-2 px-4 rounded-lg font-semibold hover:from-gray-200 hover:to-slate-200 transition-all text-center border border-gray-200"
                      >
                        Voir les détails
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Orders;
