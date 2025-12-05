import { Link } from 'react-router-dom';
import type { Product } from '@/types/product';
import { formatCurrency } from '@/utils/currency';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const finalPrice = product.discountPrice || product.price;
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;

  return (
    <div className="group bg-white rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 overflow-hidden">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative overflow-hidden aspect-[4/3]">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            loading="lazy"
          />
          {hasDiscount && (
            <div className="absolute top-4 right-4 bg-gradient-to-r from-red-500 to-pink-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              -{Math.round(((product.price - product.discountPrice!) / product.price) * 100)}%
            </div>
          )}
          {product.stock < 5 && product.stock > 0 && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-orange-500 to-amber-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              Stock limité
            </div>
          )}
          {product.featured && (
            <div className="absolute top-4 left-4 bg-gradient-to-r from-purple-500 to-blue-600 text-white px-3 py-1 rounded-full text-sm font-bold shadow-lg">
              ⭐ Populaire
            </div>
          )}
        </div>
      </Link>

      <div className="p-5">
        <Link to={`/products/${product.id}`}>
          <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary-600 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>

        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-1">
            <span className="text-yellow-500">⭐</span>
            <span className="font-semibold text-sm">{product.rating}</span>
          </div>
          <span className="text-gray-400 text-sm">({product.reviewCount} avis)</span>
        </div>

        <div className="mb-4">
          <div className="flex items-center gap-4">
            <div>
              <div className="text-xs text-gray-500">Prix cash</div>
              <div className={`text-lg font-bold ${hasDiscount ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {formatCurrency(product.price)}
              </div>
            </div>
            {product.discountPrice && (
              <div>
                <div className="text-xs text-gray-500">Prix crédit</div>
                <div className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(product.discountPrice)}
                </div>
                <div className="text-xs text-green-600 font-semibold">{formatCurrency((product.discountPrice || finalPrice) / 12)}/mois estimé</div>
              </div>
            )}
          </div>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="w-full bg-gradient-to-r from-blue-500 via-purple-600 to-pink-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:shadow-purple-500/50 hover:scale-105 transition-all flex items-center justify-center gap-2"
        >
          <ShoppingCart size={20} />
          Réserver maintenant
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
