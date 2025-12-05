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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Nos Produits</h1>
          <p className="text-xl opacity-90">Découvrez notre collection de meubles de qualité</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Filtres par catégorie */}
        <div className="mb-12">
          <div className="flex flex-wrap gap-4 justify-center">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
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
        <div className="mb-8 text-center">
          <p className="text-gray-600">
            <span className="font-bold text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              {filteredProducts.length}
            </span>{' '}
            {filteredProducts.length > 1 ? 'produits trouvés' : 'produit trouvé'}
          </p>
        </div>

        {/* Grille de produits */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-xl">Aucun produit dans cette catégorie</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

