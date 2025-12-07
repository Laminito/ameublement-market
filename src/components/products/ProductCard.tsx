import { Link } from 'react-router-dom';
import type { Product } from '@/services/productService';
import { formatCurrency } from '@/utils/currency';
import { getImageUrl } from '@/utils/imageUrl';
import { ShoppingCart } from 'lucide-react';

// Support both API Product type and local Product type
interface LocalProduct {
  id: string;
  name: string;
  description: string;
  images: (string | { url: string })[];
  price: number;
  discountPrice?: number;
  rating?: number;
  reviewCount?: number;
  featured?: boolean;
  stock?: number;
}

interface ProductCardProps {
  product: Product | LocalProduct;
}

const ProductCard = ({ product }: ProductCardProps) => {
  // Check if it's an API product or local product
  const isApiProduct = '_id' in product;
  const productId = isApiProduct ? product._id : product.id;
  
  // Handle discount
  let hasDiscount = false;
  let originalPrice = 0;
  let currentPrice = 0;
  
  if (isApiProduct) {
    hasDiscount = product.discount > 0;
    originalPrice = product.originalPrice;
    currentPrice = product.price;
  } else {
    hasDiscount = !!product.discountPrice && product.discountPrice < product.price;
    originalPrice = product.price;
    currentPrice = product.discountPrice || product.price;
  }
  
  // Handle images
  let imageUrl = '/placeholder-image.png';
  if (product.images && product.images.length > 0) {
    const firstImage = product.images[0];
    if (typeof firstImage === 'string') {
      imageUrl = firstImage.startsWith('http') ? firstImage : getImageUrl(firstImage);
    } else {
      imageUrl = getImageUrl(firstImage.url);
    }
  }

  // Handle rating
  const rating = isApiProduct ? product.rating.average : (product.rating || 0);
  const reviewCount = isApiProduct ? product.rating.count : (product.reviewCount || 0);
  const inStock = isApiProduct ? product.inStock : ((product.stock || 0) > 0);

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <Link to={`/products/${productId}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3] bg-gray-100">
          <img
            src={imageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
            onError={(e) => {
              (e.target as HTMLImageElement).src = '/placeholder-image.png';
            }}
          />
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{isApiProduct ? product.discount : Math.round(((product.price - (product.discountPrice || 0)) / product.price) * 100)}%
            </div>
          )}
          {!inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Indisponible</span>
            </div>
          )}
          {(isApiProduct ? product.featured : product.featured) && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ⭐ Populaire
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/products/${productId}`}>
          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-blue-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-sm">{isApiProduct ? rating.toFixed(1) : rating}</span>
          </div>
          <span className="text-gray-400 text-sm">({reviewCount} {reviewCount !== 1 ? 'avis' : 'avis'})</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-gray-500">Prix</div>
              <div className={`text-lg font-bold ${hasDiscount ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {formatCurrency(originalPrice)}
              </div>
            </div>
            {hasDiscount && (
              <div>
                <div className="text-xs text-gray-500">Prix réduit</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(currentPrice)}
                </div>
              </div>
            )}
            {!hasDiscount && (
              <div className="flex-1">
                <div className="text-2xl font-bold text-gray-900">
                  {formatCurrency(currentPrice)}
                </div>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/products/${productId}`}
          className={`w-full py-3 px-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 ${
            inStock
              ? 'bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <ShoppingCart size={20} />
          {inStock ? 'Voir détails' : 'Indisponible'}
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
