import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getProductById } from '@/data/products';
import { formatCurrency } from '@/utils/currency';
import { calculateCreditDetails } from '@/utils/calculator';
import { useCartStore } from '@/store/cartStore';
import { 
  ShoppingCart, 
  CreditCard, 
  Wallet, 
  Truck, 
  Shield, 
  ArrowLeft,
  Star,
  Package,
  Ruler,
  Weight,
  Check
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const product = id ? getProductById(id) : undefined;
  const addItem = useCartStore((state) => state.addItem);

  const [selectedImage, setSelectedImage] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'credit'>('cash');
  const [creditDuration, setCreditDuration] = useState<3 | 6 | 9 | 12 | 18 | 24>(12);

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
        <Link to="/products" className="text-primary-600 hover:underline">
          Retour aux produits
        </Link>
      </div>
    );
  }

  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const creditDetails = calculateCreditDetails(product.discountPrice || product.price, creditDuration);

  const handleReservation = () => {
    addItem(product);
    navigate('/payment', {
      state: {
        productId: product.id,
        paymentMode,
        creditDuration,
        priceCash: product.price,
        priceCredit: product.discountPrice || creditDetails.totalWithInterest,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <Link 
            to="/products" 
            className="inline-flex items-center gap-2 text-gray-600 hover:text-primary-600 transition"
          >
            <ArrowLeft size={20} />
            Retour aux produits
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Galerie d'images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
                </div>
              )}
            </div>

            {/* Miniatures */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`aspect-square rounded-xl overflow-hidden border-4 transition-all ${
                      selectedImage === idx
                        ? 'border-purple-600 shadow-lg scale-105'
                        : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Informations produit */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  {product.category}
                </span>
                {product.featured && (
                  <span className="px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-sm font-semibold">
                    ⭐ Populaire
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>
              
              {/* Note et avis */}
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={20}
                      className={i < Math.floor(product.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
                    />
                  ))}
                  <span className="font-semibold">{product.rating}</span>
                </div>
                <span className="text-gray-600">({product.reviewCount} avis)</span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{product.longDescription}</p>
            </div>

            {/* Prix */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Prix cash</div>
                  <div className={`font-bold ${hasDiscount ? 'text-gray-400 line-through' : 'text-gray-900'} text-2xl`}>
                    {formatCurrency(product.price)}
                  </div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Prix crédit</div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {formatCurrency(product.discountPrice || creditDetails.totalWithInterest)}
                  </div>
                </div>
              </div>
              {product.stock > 0 ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold">
                  <Check size={20} />
                  En stock ({product.stock} disponibles)
                </div>
              ) : (
                <div className="text-red-600 font-semibold">Rupture de stock</div>
              )}
            </div>

            {/* Mode de paiement */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Choisissez votre mode de paiement</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button
                  onClick={() => setPaymentMode('cash')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMode === 'cash'
                      ? 'border-green-500 bg-green-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Wallet size={32} className={`mx-auto mb-2 ${paymentMode === 'cash' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="font-bold">Paiement Cash</div>
                  <div className="text-sm text-gray-600">Payez en une fois</div>
                </button>

                <button
                  onClick={() => setPaymentMode('credit')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    paymentMode === 'credit'
                      ? 'border-purple-500 bg-purple-50 shadow-lg scale-105'
                      : 'border-gray-200 hover:border-purple-300'
                  }`}
                >
                  <CreditCard size={32} className={`mx-auto mb-2 ${paymentMode === 'credit' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="font-bold">Paiement à Crédit</div>
                  <div className="text-sm text-gray-600">Payez en plusieurs fois</div>
                </button>
              </div>

              {/* Options de crédit */}
              {paymentMode === 'credit' && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl mb-6">
                  <h4 className="font-bold mb-4">Durée de crédit</h4>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {([3, 6, 9, 12, 18, 24] as const).map((duration) => (
                      <button
                        key={duration}
                        onClick={() => setCreditDuration(duration)}
                        className={`py-3 rounded-lg font-semibold transition-all ${
                          creditDuration === duration
                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                            : 'bg-white text-gray-700 hover:shadow-md'
                        }`}
                      >
                        {duration} mois
                      </button>
                    ))}
                  </div>

                  <div className="space-y-3 bg-white p-4 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Montant total :</span>
                      <span className="font-bold">{formatCurrency(creditDetails.totalWithInterest)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Intérêts ({Math.round(creditDetails.interestRate * 100)}%) :</span>
                      <span className="font-semibold text-orange-600">{formatCurrency(creditDetails.totalInterest)}</span>
                    </div>
                    <div className="border-t pt-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">Mensualité :</span>
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                          {formatCurrency(creditDetails.monthlyInstallment)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Bouton de réservation */}
              <button
                onClick={handleReservation}
                disabled={product.stock === 0}
                className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={24} />
                {paymentMode === 'cash' ? 'Réserver - Paiement Cash' : `Réserver - ${creditDuration} mois`}
              </button>
            </div>

            {/* Caractéristiques */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Caractéristiques</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Ruler className="text-blue-600 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-sm text-gray-600">Dimensions</div>
                    <div className="font-bold">{product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} {product.dimensions.unit}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Weight className="text-purple-600 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-sm text-gray-600">Poids</div>
                    <div className="font-bold">{product.weight} kg</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Package className="text-orange-600 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-sm text-gray-600">Matériau</div>
                    <div className="font-bold">{product.material.join(', ')}</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Shield className="text-green-600 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-sm text-gray-600">Garantie</div>
                    <div className="font-bold">{product.warranty}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Avantages */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-xl">
                <Truck className="text-blue-600" size={24} />
                <div className="text-sm">
                  <div className="font-bold">Livraison gratuite</div>
                  <div className="text-gray-600">Sous 7 jours</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                <Shield className="text-purple-600" size={24} />
                <div className="text-sm">
                  <div className="font-bold">Garantie {product.warranty}</div>
                  <div className="text-gray-600">Service après-vente</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
