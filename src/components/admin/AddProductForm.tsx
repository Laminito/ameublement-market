import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, RefreshCw } from 'lucide-react';
import type { AdminProductPayload } from '@/services/adminProductService';
import AdminProductService from '@/services/adminProductService';
import CategoryService from '@/services/categoryService';
import ProductTypeService from '@/services/productTypeService';
import SKUService from '@/services/skuService';
import type { Category } from '@/services/categoryService';
import type { ProductType } from '@/services/productTypeService';

interface AddProductFormProps {
  onSuccess?: () => void;
  onCancel?: () => void;
}

const AddProductForm: React.FC<AddProductFormProps> = ({ onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [skuLoading, setSkuLoading] = useState(false);

  // Data from APIs
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [formData, setFormData] = useState<Partial<AdminProductPayload>>({
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    category: '',
    sku: '',
    images: [],
    dimensions: {
      length: 0,
      width: 0,
      height: 0,
      weight: 0,
    },
    materials: [],
    colors: [],
    inStock: true,
    stockQuantity: 0,
    brand: '',
    tags: [],
    featured: false,
    isActive: true,
  });

  const [productTypeCode, setProductTypeCode] = useState('');
  const [variantInput, setVariantInput] = useState('');

  const [materialInput, setMaterialInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string>('');

  // Load categories and product types on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        console.log('Loading categories and product types...');
        
        const [cats, types] = await Promise.all([
          CategoryService.getCategories(true),
          ProductTypeService.getProductTypes(),
        ]);
        
        console.log('Loaded categories:', cats);
        console.log('Loaded product types:', types);
        
        setCategories(cats);
        setProductTypes(types);
      } catch (err) {
        console.error('Failed to load categories and product types:', err);
        setError(`Failed to load categories and product types: ${err instanceof Error ? err.message : String(err)}`);
      } finally {
        setLoadingData(false);
      }
    };

    loadData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const parsedValue = type === 'number' ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: parsedValue,
    }));
  };

  const handleDimensionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      dimensions: {
        ...prev.dimensions!,
        [name]: parseFloat(value),
      },
    }));
  };

  const handleGenerateSKU = async () => {
    if (!productTypeCode || !formData.category) {
      setError('Veuillez sélectionner un type de produit et une catégorie');
      return;
    }

    try {
      setSkuLoading(true);
      setError(null);

      // Get the category slug
      const selectedCategory = categories.find((c) => c._id === formData.category);
      if (!selectedCategory) {
        throw new Error('Catégorie non trouvée');
      }

      // Try to generate SKU from API, fallback to local generation
      let sku: string;
      try {
        sku = await SKUService.generateSKU({
          productTypeCode,
          categorySlug: selectedCategory.slug,
          variant: variantInput || undefined,
        });
      } catch (err) {
        console.warn('API SKU generation failed, using local generation:', err);
        sku = SKUService.generateSKULocally(productTypeCode, selectedCategory.slug, variantInput);
      }

      setFormData((prev) => ({
        ...prev,
        sku,
      }));
    } catch (err) {
      setError(`Erreur lors de la génération du SKU: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSkuLoading(false);
    }
  };

  const handleAddMaterial = () => {
    if (materialInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        materials: [...(prev.materials || []), materialInput.trim()],
      }));
      setMaterialInput('');
    }
  };

  const handleRemoveMaterial = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      materials: prev.materials!.filter((_, i) => i !== index),
    }));
  };

  const handleAddColor = () => {
    if (colorInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        colors: [...(prev.colors || []), colorInput.trim()],
      }));
      setColorInput('');
    }
  };

  const handleRemoveColor = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      colors: prev.colors!.filter((_, i) => i !== index),
    }));
  };

  const handleAddTag = () => {
    if (tagInput.trim()) {
      setFormData((prev) => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()],
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags!.filter((_, i) => i !== index),
    }));
  };

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.currentTarget.files;
    if (files) {
      const newImages = Array.from(files).map((file) => ({
        file,
        publicId: `product-${Date.now()}-${Math.random()}`,
        alt: file.name,
      }));
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...newImages],
      }));
    }
  };

  const handleAddImageUrl = () => {
    if (imageUrls.trim()) {
      const newImage = {
        url: imageUrls.trim(),
        publicId: `product-${Date.now()}`,
        alt: 'Product image',
      };
      setFormData((prev) => ({
        ...prev,
        images: [...(prev.images || []), newImage],
      }));
      setImageUrls('');
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images!.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.category || !formData.sku) {
      setError('Veuillez remplir tous les champs obligatoires');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      await AdminProductService.createProduct(formData as AdminProductPayload);

      setSuccessMessage('Produit créé avec succès!');
      setTimeout(() => {
        onSuccess?.();
      }, 1500);
    } catch (err) {
      setError(`Erreur: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingData) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-md max-w-4xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold mb-6">Ajouter un nouveau produit</h2>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">{error}</div>}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">{successMessage}</div>
      )}

      {/* Informations de base */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nom du produit *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ex: Lit double en bois"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Catégorie *</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Type de produit</label>
          <select
            value={productTypeCode}
            onChange={(e) => setProductTypeCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="">Sélectionner un type</option>
            {productTypes.map((type) => (
              <option key={type._id} value={type.code}>
                {type.name} ({type.code})
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Marque</label>
          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Ex: IKEA"
          />
        </div>
      </div>

      {/* Génération de SKU */}
      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-semibold mb-3">Génération de SKU</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Variante (optionnel)</label>
            <input
              type="text"
              value={variantInput}
              onChange={(e) => setVariantInput(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded"
              placeholder="Ex: double-bois"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SKU *</label>
            <input
              type="text"
              name="sku"
              value={formData.sku}
              onChange={handleInputChange}
              className="w-full p-2 border border-gray-300 rounded bg-gray-100"
              placeholder="Auto-généré"
              required
              readOnly
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleGenerateSKU}
              disabled={skuLoading || !productTypeCode || !formData.category}
              className="w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              <RefreshCw size={18} />
              {skuLoading ? 'Génération...' : 'Générer SKU'}
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded"
          rows={4}
          placeholder="Description détaillée du produit"
        />
      </div>

      {/* Prix et stock */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Prix (MAD)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Prix original</label>
          <input
            type="number"
            name="originalPrice"
            value={formData.originalPrice}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
            step="0.01"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Réduction (%)</label>
          <input
            type="number"
            name="discount"
            value={formData.discount}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
            max="100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Stock</label>
          <input
            type="number"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
            min="0"
          />
        </div>
      </div>

      {/* Dimensions */}
      <div>
        <h3 className="font-semibold mb-3">Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Longueur (cm)</label>
            <input
              type="number"
              name="length"
              value={formData.dimensions?.length || 0}
              onChange={handleDimensionChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Largeur (cm)</label>
            <input
              type="number"
              name="width"
              value={formData.dimensions?.width || 0}
              onChange={handleDimensionChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Hauteur (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.dimensions?.height || 0}
              onChange={handleDimensionChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Poids (kg)</label>
            <input
              type="number"
              name="weight"
              value={formData.dimensions?.weight || 0}
              onChange={handleDimensionChange}
              className="w-full p-2 border border-gray-300 rounded"
              min="0"
            />
          </div>
        </div>
      </div>

      {/* Matériaux */}
      <div>
        <h3 className="font-semibold mb-3">Matériaux</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={materialInput}
            onChange={(e) => setMaterialInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="Ex: Bois massif"
          />
          <button type="button" onClick={handleAddMaterial} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.materials?.map((material, index) => (
            <div key={index} className="bg-blue-100 px-3 py-1 rounded flex items-center gap-2">
              {material}
              <button type="button" onClick={() => handleRemoveMaterial(index)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Couleurs */}
      <div>
        <h3 className="font-semibold mb-3">Couleurs</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={colorInput}
            onChange={(e) => setColorInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="Ex: Noir"
          />
          <button type="button" onClick={handleAddColor} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.colors?.map((color, index) => (
            <div key={index} className="bg-green-100 px-3 py-1 rounded flex items-center gap-2">
              {color}
              <button type="button" onClick={() => handleRemoveColor(index)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Tags */}
      <div>
        <h3 className="font-semibold mb-3">Tags</h3>
        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded"
            placeholder="Ex: Premium"
          />
          <button type="button" onClick={handleAddTag} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags?.map((tag, index) => (
            <div key={index} className="bg-purple-100 px-3 py-1 rounded flex items-center gap-2">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(index)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Images */}
      <div>
        <h3 className="font-semibold mb-3">Images</h3>
        <div className="bg-gray-50 p-4 rounded border-2 border-dashed border-gray-300">
          <label className="flex items-center justify-center gap-2 cursor-pointer hover:bg-gray-100 p-3 rounded">
            <Upload size={20} />
            <span>Télécharger des images</span>
            <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
          </label>
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium mb-2">Ou ajouter via URL</label>
          <div className="flex gap-2">
            <input
              type="url"
              value={imageUrls}
              onChange={(e) => setImageUrls(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded"
              placeholder="https://example.com/image.jpg"
            />
            <button type="button" onClick={handleAddImageUrl} className="p-2 bg-blue-600 text-white rounded hover:bg-blue-700">
              <Plus size={20} />
            </button>
          </div>
        </div>

        {formData.images && formData.images.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
            {formData.images.map((image, index) => (
              <div key={index} className="relative group">
                <img
                  src={'file' in image ? URL.createObjectURL(image.file as File) : image.url}
                  alt={image.alt}
                  className="w-full h-24 object-cover rounded"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition"
                >
                  <X size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Statut */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="inStock"
            checked={formData.inStock}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                inStock: e.target.checked,
              }))
            }
            className="w-4 h-4"
          />
          <span>En stock</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="featured"
            checked={formData.featured}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                featured: e.target.checked,
              }))
            }
            className="w-4 h-4"
          />
          <span>Produit en vedette</span>
        </label>

        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={formData.isActive}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                isActive: e.target.checked,
              }))
            }
            className="w-4 h-4"
          />
          <span>Actif</span>
        </label>
      </div>

      {/* Boutons */}
      <div className="flex gap-4 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 p-3 bg-green-600 text-white rounded hover:bg-green-700 disabled:bg-gray-400 font-medium"
        >
          {loading ? 'Création en cours...' : 'Créer le produit'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 p-3 bg-gray-400 text-white rounded hover:bg-gray-500 font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};

export default AddProductForm;
