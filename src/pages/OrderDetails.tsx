import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Package, Clock, MapPin, DollarSign, Printer, Download, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import OrderService from '@/services/orderService';
import type { Order } from '@/types/order';

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        if (!id) {
          navigate('/orders');
          return;
        }

        const fetchedOrder = await OrderService.getOrderById(id);
        setOrder(fetchedOrder);
      } catch (err) {
        console.error('Failed to load order:', err);
        setError(err instanceof Error ? err.message : 'Failed to load order');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      processing: 'bg-purple-100 text-purple-800',
      shipped: 'bg-indigo-100 text-indigo-800',
      delivered: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.pending;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      pending: 'En attente',
      confirmed: 'Confirmée',
      processing: 'En traitement',
      shipped: 'Expédiée',
      delivered: 'Livrée',
      cancelled: 'Annulée',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <p className="text-red-600 text-lg mb-4">{error || 'Order not found'}</p>
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/orders')}
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 font-medium mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            Back to Orders
          </button>

          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                Order {order.orderNumber}
              </h1>
              <p className="text-gray-600">
                Placed on {new Date(order.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                <Printer className="w-5 h-5" />
                Print
              </button>
              <button className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
                <Download className="w-5 h-5" />
                Invoice
              </button>
            </div>
          </div>
        </div>

        {/* Status Badge */}
        <div className="mb-8">
          <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(order.status)}`}>
            {getStatusLabel(order.status)}
          </span>
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Items Section */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Package className="w-5 h-5 text-purple-600" />
                Order Items
              </h2>

              <div className="space-y-4">
                {order.items.map((item, idx) => {
                  const itemPrice = item.price || 0;
                  const itemQty = item.quantity || 0;
                  const itemImage = item.image || (item.product?.images?.[0]?.url);
                  const itemName = item.productName || item.product?.name || 'Product';

                  return (
                    <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg">
                      {itemImage && (
                        <img
                          src={itemImage}
                          alt={itemName}
                          className="w-20 h-20 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{itemName}</h3>
                        <p className="text-sm text-gray-600">Qty: {itemQty}</p>
                        <p className="text-sm font-medium text-gray-900">fcfa{itemPrice.toFixed(2)}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          fcfa{(itemPrice * itemQty).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Shipping Address */}
            {/* Shipping Address */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Shipping Address
              </h2>

              <div className="text-gray-700">
                {(order.shippingAddress || order.deliveryAddress) && (
                  <>
                    <p className="font-semibold">
                      {(order.shippingAddress?.firstName || order.deliveryAddress?.firstName || '')} {(order.shippingAddress?.lastName || order.deliveryAddress?.lastName || '')}
                    </p>
                    <p>{order.shippingAddress?.street || order.deliveryAddress?.street}</p>
                    <p>{order.shippingAddress?.postalCode || order.deliveryAddress?.postalCode} {order.shippingAddress?.city || order.deliveryAddress?.city}</p>
                    <p className="mt-2">{order.shippingAddress?.phone || order.deliveryAddress?.phone}</p>
                  </>
                )}
              </div>

              {order.tracking && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-900 font-medium">Tracking Number</p>
                  <p className="text-lg font-mono font-bold text-blue-600 mt-1">
                    {order.tracking.trackingNumber}
                  </p>
                  <p className="text-sm text-blue-800 mt-2">
                    Estimated Delivery: {new Date(order.tracking.estimatedDelivery).toLocaleDateString('fr-FR')}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            {/* Price Summary */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-purple-600" />
                Order Summary
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">€{(order.pricing?.subtotal || order.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-medium">€{(order.pricing?.shipping || order.deliveryFee || 0).toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax (20%)</span>
                  <span className="font-medium">€{(order.pricing?.tax || order.tax || 0).toFixed(2)}</span>
                </div>
                <div className="pt-3 border-t border-gray-200 flex justify-between font-bold text-base">
                  <span>Total</span>
                  <span className="text-purple-600">€{(order.pricing?.total || order.totalAmount || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Payment</h3>

              <div className="space-y-3 text-sm">
                <div>
                  <p className="text-gray-600 mb-1">Method</p>
                  <p className="font-medium capitalize">{order.payment?.method || order.paymentMethod || 'Unknown'}</p>
                </div>
                <div>
                  <p className="text-gray-600 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                    (order.payment?.status || order.paymentStatus)?.toLowerCase() === 'paid' || (order.payment?.status || order.paymentStatus)?.toLowerCase() === 'partially_paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {order.payment?.status || order.paymentStatus || 'Pending'}
                  </span>
                </div>
              </div>
            </div>

            {/* Kredika Info */}
            {(order.payment?.method || order.paymentMethod)?.toString().toLowerCase() === 'kredika' && (
              <div className="bg-purple-50 rounded-xl border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Kredika Payment Plan</h3>

                <div className="space-y-3 text-sm">
                  <p className="text-gray-700">
                    Your payment has been scheduled in installments. Check your email for payment instructions.
                  </p>
                  {order.payment?.kredikaTransactionId && (
                    <div>
                      <p className="text-gray-600">Transaction ID</p>
                      <p className="font-mono text-xs text-gray-900 break-all">
                        {order.payment.kredikaTransactionId}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-purple-600" />
            Order Timeline
          </h2>

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-600 mt-2"></div>
                <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Order Placed</p>
                <p className="text-sm text-gray-600">{new Date(order.createdAt).toLocaleDateString('fr-FR')}</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  ['confirmed', 'processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}></div>
                <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Order Confirmed</p>
                <p className="text-sm text-gray-600">Awaiting payment</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  ['processing', 'shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}></div>
                <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Processing</p>
                <p className="text-sm text-gray-600">Preparing your order</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  ['shipped', 'delivered'].includes(order.status)
                    ? 'bg-green-600'
                    : 'bg-gray-300'
                }`}></div>
                <div className="w-0.5 h-16 bg-gray-300 my-1"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Shipped</p>
                <p className="text-sm text-gray-600">On its way to you</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className={`w-3 h-3 rounded-full ${
                  order.status === 'DELIVERED' ? 'bg-green-600' : 'bg-gray-300'
                }`}></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Delivered</p>
                <p className="text-sm text-gray-600">Order complete</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
