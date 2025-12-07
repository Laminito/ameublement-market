import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { formatCurrency } from '@/utils/currency';
import { getImageUrl } from '@/utils/imageUrl';
import { calculateCreditDetails } from '@/utils/calculator';
import { useCartStore } from '@/store/cartStore';
import ProductService, { type Product } from '@/services/productService';
import { 
  ShoppingCart, 
  CreditCard, 
  Wallet, 
  Truck, 
  Shield, 
  ArrowLeft,
  Star,
  Ruler,
  Weight,
  Check
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const addItem = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [paymentMode, setPaymentMode] = useState<'cash' | 'credit'>('cash');
  const [creditDuration, setCreditDuration] = useState<3 | 6 | 9 | 12 | 18 | 24>(12);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) {
        setError('ID du produit manquant');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const response = await ProductService.getProductById(id);
        setProduct(response.data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement du produit';
        setError(errorMessage);
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold mb-4">Produit non trouvé</h1>
        {error && <p className="text-red-600 mb-4">{error}</p>}
        <Link to="/products" className="text-blue-600 hover:underline flex items-center justify-center gap-2">
          <ArrowLeft size={20} />
          Retour aux produits
        </Link>
      </div>
    );
  }

  const hasDiscount = product.discount > 0;
  const creditDetails = calculateCreditDetails(product.price, creditDuration);

  const handleReservation = () => {
    // Adapt API product to local Product type for cart
    const cartProduct: any = {
      id: product._id,
      name: product.name,
      description: product.description,
      longDescription: product.description,
      category: product.category.slug as any,
      price: product.price,
      discountPrice: product.discount > 0 ? product.price : undefined,
      images: product.images.map((img) => img.url),
      dimensions: product.dimensions,
      weight: product.dimensions.weight,
      material: product.materials,
      color: product.colors,
      style: 'moderne' as any,
      brand: product.brand,
      stock: product.stockQuantity,
      featured: product.featured,
      rating: product.rating.average,
      reviewCount: product.rating.count,
      assemblyRequired: false,
      warranty: '1 an',
      careInstructions: 'Voir les détails',
      tags: product.tags,
      createdAt: new Date(product.createdAt),
      updatedAt: new Date(product.updatedAt),
      subcategory: undefined,
      video: undefined,
    };

    addItem(cartProduct, 1);
    navigate('/payment', {
      state: {
        productId: product._id,
        paymentMode,
        creditDuration,
        priceCash: product.price,
        priceCredit: creditDetails.totalWithInterest,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-3 sm:py-4">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm sm:text-base text-gray-600 hover:text-blue-600 transition">
            <ArrowLeft size={18} />
            Retour aux produits
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-7xl w-full">
        <div className="grid lg:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative bg-white rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img
                src={getImageUrl(product.images[selectedImage]?.url || product.images[0]?.url || '/placeholder-image.png')}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }}
              />
              {hasDiscount && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-4 py-2 rounded-full text-lg font-bold shadow-lg">
                  -{product.discount}%
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <button key={idx} onClick={() => setSelectedImage(idx)} className={`aspect-square rounded-xl overflow-hidden border-4 transition-all ${selectedImage === idx ? 'border-purple-600 shadow-lg scale-105' : 'border-transparent hover:border-gray-300'}`}>
                    <img src={getImageUrl(img.url)} alt={`${product.name} ${idx + 1}`} className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder-image.png'; }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold">{product.category.name}</span>
                {product.featured && <span className="px-2 sm:px-3 py-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-full text-xs sm:text-sm font-semibold">⭐ Populaire</span>}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{product.name}</h1>
              
              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  {[...Array(5)].map((_, i) => (<Star key={i} size={20} className={i < Math.floor(product.rating.average) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />))}
                  <span className="font-semibold">{product.rating.average.toFixed(1)}</span>
                </div>
                <span className="text-gray-600">({product.rating.count} {product.rating.count > 1 ? 'avis' : 'avis'})</span>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">{product.description}</p>
            </div>

            {/* Prix */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-2xl">
              <div className="grid grid-cols-2 gap-6 mb-4">
                <div>
                  <div className="text-sm text-gray-600 mb-1">Prix original</div>
                  <div className={`font-bold ${hasDiscount ? 'text-gray-400 line-through' : 'text-gray-900'} text-2xl`}>{formatCurrency(product.originalPrice)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-600 mb-1">Prix actuel</div>
                  <div className="text-3xl font-bold text-gray-900">{formatCurrency(product.price)}</div>
                </div>
              </div>
              {product.inStock ? (
                <div className="flex items-center gap-2 text-green-600 font-semibold"><Check size={20} />En stock ({product.stockQuantity} {product.stockQuantity > 1 ? 'disponibles' : 'disponible'})</div>
              ) : (
                <div className="text-red-600 font-semibold">Rupture de stock</div>
              )}
            </div>

            {/* Paiement */}
            <div className="bg-white p-6 rounded-2xl shadow-lg">
              <h3 className="text-xl font-bold mb-4">Mode de paiement</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <button onClick={() => setPaymentMode('cash')} className={`p-4 rounded-xl border-2 transition-all ${paymentMode === 'cash' ? 'border-green-500 bg-green-50 shadow-lg scale-105' : 'border-gray-200 hover:border-green-300'}`}>
                  <Wallet size={32} className={`mx-auto mb-2 ${paymentMode === 'cash' ? 'text-green-600' : 'text-gray-400'}`} />
                  <div className="font-bold">Paiement Cash</div>
                  <div className="text-sm text-gray-600">Payez en une fois</div>
                </button>

                <button onClick={() => setPaymentMode('credit')} className={`p-4 rounded-xl border-2 transition-all ${paymentMode === 'credit' ? 'border-purple-500 bg-purple-50 shadow-lg scale-105' : 'border-gray-200 hover:border-purple-300'}`}>
                  <CreditCard size={32} className={`mx-auto mb-2 ${paymentMode === 'credit' ? 'text-purple-600' : 'text-gray-400'}`} />
                  <div className="font-bold">Paiement à Crédit</div>
                  <div className="text-sm text-gray-600">Payez en plusieurs fois</div>
                </button>
              </div>

              {paymentMode === 'credit' && (
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl mb-6">
                  <h4 className="font-bold mb-4">Durée de crédit</h4>
                  <div className="grid grid-cols-3 gap-3 mb-6">
                    {([3, 6, 9, 12, 18, 24] as const).map((duration) => (
                      <button key={duration} onClick={() => setCreditDuration(duration)} className={`py-3 rounded-lg font-semibold transition-all ${creditDuration === duration ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
                        {duration}M
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
                        <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">{formatCurrency(creditDetails.monthlyInstallment)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleReservation} disabled={!product.inStock} className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white py-4 px-6 rounded-xl font-bold text-lg hover:shadow-xl hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed">
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
                    <div className="font-bold">{product.dimensions.length} x {product.dimensions.width} x {product.dimensions.height} cm</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Weight className="text-purple-600 flex-shrink-0" size={20} />
                  <div>
                    <div className="font-semibold text-sm text-gray-600">Poids</div>
                    <div className="font-bold">{product.dimensions.weight} kg</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-xl">
                  <Truck className="text-green-600" size={24} />
                  <div className="text-sm">
                    <div className="font-bold">Livraison gratuite</div>
                    <div className="text-gray-600">Sous 7 jours</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-purple-50 p-4 rounded-xl">
                  <Shield className="text-purple-600" size={24} />
                  <div className="text-sm">
                    <div className="font-bold">Garantie</div>
                    <div className="text-gray-600">Service après-vente</div>
                  </div>
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
