import { useState, useEffect } from 'react';
import ProductCard from '@/components/products/ProductCard';
import ProductService, { type Product } from '@/services/productService';

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [categories, setCategories] = useState<{ id: string; name: string; icon: string }[]>([
    { id: 'all', name: 'Tous les produits', icon: '🏠' },
  ]);

  // Fetch products on mount and when page/category changes
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        if (selectedCategory === 'all') {
          response = await ProductService.getProducts(currentPage, 12);
        } else {
          response = await ProductService.getProductsByCategory(selectedCategory);
        }

        setProducts(response.data);
        setTotalPages(response.pagination.totalPages);

        // Extract unique categories from products if first load
        if (categories.length === 1) {
          const uniqueCategories = new Map();
          response.data.forEach((product) => {
            if (!uniqueCategories.has(product.category.slug)) {
              uniqueCategories.set(product.category.slug, {
                id: product.category.slug,
                name: product.category.name,
                icon: '📦',
              });
            }
          });

          if (uniqueCategories.size > 0) {
            setCategories([
              { id: 'all', name: 'Tous les produits', icon: '🏠' },
              ...Array.from(uniqueCategories.values()),
            ]);
          }
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Erreur lors du chargement des produits';
        setError(errorMessage);
        console.error('Error fetching products:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory, currentPage]);

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setCurrentPage(1);
  };

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
                onClick={() => handleCategoryChange(cat.id)}
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

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        )}

        {/* Error state */}
        {error && !loading && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 text-red-700">
            <p className="font-semibold">Erreur</p>
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Compteur de produits */}
        {!loading && (
          <div className="mb-6 sm:mb-8 text-center">
            <p className="text-sm sm:text-base text-gray-600">
              <span className="font-bold text-xl sm:text-2xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {products.length}
              </span>{' '}
              {products.length > 1 ? 'produits trouvés' : 'produit trouvé'}
            </p>
          </div>
        )}

        {/* Grille de produits */}
        {!loading && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 md:gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && products.length === 0 && (
          <div className="text-center py-12 sm:py-16">
            <p className="text-gray-500 text-lg sm:text-xl">Aucun produit trouvé</p>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="mt-8 sm:mt-12 flex justify-center items-center gap-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Précédent
            </button>

            <div className="flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-2 rounded-lg font-semibold transition-all ${
                    currentPage === page
                      ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                      : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

