import React, { useState, useEffect } from 'react';
import { Edit2, Trash2, Plus, Search, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import AdminProductService from '@/services/adminProductService';
import type { Product } from '@/services/productService';
import AddProductForm from '@/components/admin/AddProductForm';
import EditProductForm from '@/components/admin/EditProductForm';
import { getImageUrl } from '@/utils/imageUrl';

const AdminProducts: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [view, setView] = useState<'list' | 'add' | 'edit'>('list');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const loadProducts = async (page = 1) => {
    try {
      setLoading(true);
      setError(null);
      const response = await AdminProductService.getAllProducts(page, 20);
      setProducts(response.data || []);
      setTotalPages(response.totalPages || 1);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur lors du chargement des produits');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (view === 'list') {
      loadProducts(currentPage);
    }
  }, [view]);

  const handleDelete = async (id: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      return;
    }

    try {
      await AdminProductService.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
      alert('Produit supprimé avec succès');
    } catch (err) {
      alert('Erreur lors de la suppression: ' + (err instanceof Error ? err.message : 'Erreur inconnue'));
    }
  };

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (view === 'add') {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => setView('list')} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft size={20} />
            Retour à la liste
          </button>
          <h1 className="text-3xl font-bold mb-8">Ajouter un nouveau produit</h1>
          <AddProductForm onSuccess={() => setView('list')} onCancel={() => setView('list')} />
        </div>
      </div>
    );
  }

  if (view === 'edit' && selectedProduct) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
        <div className="max-w-4xl mx-auto">
          <button onClick={() => { setView('list'); setSelectedProduct(null); }} className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6">
            <ArrowLeft size={20} />
            Retour à la liste
          </button>
          <h1 className="text-3xl font-bold mb-8">Éditer le produit: {selectedProduct.name}</h1>
          <EditProductForm product={selectedProduct} onSuccess={() => { setView('list'); setSelectedProduct(null); loadProducts(currentPage); }} onCancel={() => { setView('list'); setSelectedProduct(null); }} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/profile" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-blue-600 mb-4">
            <ArrowLeft size={18} />
            Retour au profil
          </Link>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl sm:text-4xl font-bold">Gestion des produits</h1>
            <button onClick={() => setView('add')} className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg transition">
              <Plus size={20} />
              Ajouter un produit
            </button>
          </div>
        </div>

        {/* Erreur */}
        {error && <div className="p-4 bg-red-100 text-red-700 rounded-lg mb-6">{error}</div>}

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher par nom, SKU ou marque..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
            />
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600 text-lg">Aucun produit trouvé</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Image</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Nom</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">SKU</th>
                  <th className="px-6 py-4 text-left font-semibold text-gray-700">Marque</th>
                  <th className="px-6 py-4 text-right font-semibold text-gray-700">Prix</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Stock</th>
                  <th className="px-6 py-4 text-center font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4">
                      <img
                        src={getImageUrl(product.images[0]?.url || '/placeholder.png')}
                        alt={product.name}
                        className="w-12 h-12 object-cover rounded"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder.png';
                        }}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">{product.category.name}</p>
                    </td>
                    <td className="px-6 py-4 text-gray-700">{product.sku}</td>
                    <td className="px-6 py-4 text-gray-700">{product.brand}</td>
                    <td className="px-6 py-4 text-right font-semibold text-gray-800">{product.price.toLocaleString()} DZD</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.inStock ? `${product.stockQuantity}` : 'Rupture'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedProduct(product);
                            setView('edit');
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded transition"
                          title="Éditer"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="p-2 text-red-600 hover:bg-red-100 rounded transition" title="Supprimer">
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && filteredProducts.length > 0 && (
          <div className="mt-6 flex justify-center items-center gap-4">
            <button
              onClick={() => loadProducts(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Précédent
            </button>
            <span className="text-gray-700 font-semibold">
              Page {currentPage} sur {totalPages}
            </span>
            <button
              onClick={() => loadProducts(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded disabled:opacity-50"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminProducts;
