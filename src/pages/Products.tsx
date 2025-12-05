import { useState } from 'react';
import { productsData } from '@/data/products';
import ProductCard from '@/components/products/ProductCard';

const categories = [
  { id: 'all', name: 'Tous les produits', icon: '🏠' },
  { id: 'chambres', name: 'Chambres', icon: '🛏️' },
  { id: 'salons', name: 'Salons', icon: '🛋️' },
  { id: 'cuisines', name: 'Cuisines', icon: '🍳' },
  { id: 'bureaux', name: 'Bureaux', icon: '💼' },
];

const Products = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredProducts = selectedCategory === 'all' 
    ? productsData 
    : productsData.filter(p => p.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 w-full overflow-x-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-12 sm:py-16 w-full">
        <div className="container mx-auto px-4 max-w-7xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-3 sm:mb-4">Nos Produits</h1>
          <p className="text-base sm:text-lg md:text-xl opacity-90">Découvrez notre collection de meubles de qualité</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6 sm:py-8 md:py-12 max-w-7xl w-full">
        {/* Filtres par catégorie */}
        <div className="mb-6 sm:mb-8 md:mb-12 w-full">
          <div className="flex flex-wrap gap-2 sm:gap-3 md:gap-4 justify-center w-full">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-4 md:px-5 lg:px-6 py-2 sm:py-2.5 md:py-3 rounded-xl font-semibold transition-all text-xs sm:text-sm md:text-base ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg shadow-purple-500/50 scale-105'
                    : 'bg-white text-gray-700 hover:shadow-md hover:scale-105'
                }`}
              >
                <span className="mr-2">{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Compteur de produits */}
        <div className="mb-6 sm:mb-8 text-center">
          <p className="text-sm sm:text-base text-gray-600">
            <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {filteredProducts.length}
            </span>{' '}
            {filteredProducts.length > 1 ? 'produits trouvés' : 'produit trouvé'}
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-lg sm:text-xl">Aucun produit dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

