import React, { useState, useEffect } from 'react';
import { Upload, X, Plus, RefreshCw } from 'lucide-react';
import type { AdminProductPayload } from '@/services/adminProductService';
import AdminProductService from '@/services/adminProductService';
import type { Product } from '@/services/productService';
import CategoryService from '@/services/categoryService';
import ProductTypeService from '@/services/productTypeService';
import SKUService from '@/services/skuService';
import type { Category } from '@/services/categoryService';
import type { ProductType } from '@/services/productTypeService';

interface EditProductFormProps {
  product: Product;
  onSuccess?: () => void;
  onCancel?: () => void;
}

const EditProductForm: React.FC<EditProductFormProps> = ({ product, onSuccess, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [skuLoading, setSkuLoading] = useState(false);

  // Data from APIs
  const [categories, setCategories] = useState<Category[]>([]);
  const [productTypes, setProductTypes] = useState<ProductType[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const [productTypeCode, setProductTypeCode] = useState('');
  const [variantInput, setVariantInput] = useState('');

  const [formData, setFormData] = useState<Partial<AdminProductPayload>>({
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice,
    discount: product.discount,
    category: product.category._id,
    sku: product.sku,
    images: product.images.map((img) => ({
      url: img.url,
      publicId: img.publicId,
      alt: img.alt,
    })),
    dimensions: product.dimensions,
    materials: product.materials,
    colors: product.colors,
    inStock: product.inStock,
    stockQuantity: product.stockQuantity,
    brand: product.brand,
    tags: product.tags,
    featured: product.featured,
    isActive: product.isActive,
  });

  const [materialInput, setMaterialInput] = useState('');
  const [colorInput, setColorInput] = useState('');
  const [tagInput, setTagInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string>('');

  // Load categories and product types on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoadingData(true);
        const [cats, types] = await Promise.all([
          CategoryService.getCategories(true),
          ProductTypeService.getProductTypes(),
        ]);
        setCategories(cats);
        setProductTypes(types);
      } catch (err) {
        console.error('Failed to load categories and product types:', err);
        setError('Failed to load categories and product types');
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

      const selectedCategory = categories.find((c) => c._id === formData.category);
      if (!selectedCategory) {
        throw new Error('Catégorie non trouvée');
      }

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

      await AdminProductService.updateProduct(product._id, formData as AdminProductPayload);

      setSuccessMessage('Produit mis à jour avec succès!');
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
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-lg">
      {error && <div className="p-4 bg-red-100 text-red-700 rounded">{error}</div>}
      {successMessage && <div className="p-4 bg-green-100 text-green-700 rounded">{successMessage}</div>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Nom du produit *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full p-2 border border-gray-300 rounded"
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
          <input type="text" name="brand" value={formData.brand} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
      </div>

      <div className="bg-blue-50 p-4 rounded border border-blue-200">
        <h3 className="font-semibold mb-3">SKU</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label className="block text-sm font-medium mb-2">Variante</label>
            <input type="text" value={variantInput} onChange={(e) => setVariantInput(e.target.value)} className="w-full p-2 border border-gray-300 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">SKU *</label>
            <input type="text" name="sku" value={formData.sku} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded bg-gray-100" required readOnly />
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

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea name="description" value={formData.description} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded h-24" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Prix</label>
          <input type="number" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Prix original</label>
          <input type="number" name="originalPrice" value={formData.originalPrice} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Remise (%)</label>
          <input type="number" name="discount" value={formData.discount} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded" min="0" max="100" />
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Longueur</label>
          <input type="number" name="length" value={formData.dimensions?.length} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Largeur</label>
          <input type="number" name="width" value={formData.dimensions?.width} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Hauteur</label>
          <input type="number" name="height" value={formData.dimensions?.height} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Poids</label>
          <input type="number" name="weight" value={formData.dimensions?.weight} onChange={handleDimensionChange} className="w-full p-2 border border-gray-300 rounded" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Matériaux</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={materialInput} onChange={(e) => setMaterialInput(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" placeholder="Ajouter un matériau" />
          <button type="button" onClick={handleAddMaterial} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.materials?.map((material, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded">
              {material}
              <button type="button" onClick={() => handleRemoveMaterial(idx)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Couleurs</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={colorInput} onChange={(e) => setColorInput(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" placeholder="Ajouter une couleur" />
          <button type="button" onClick={handleAddColor} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.colors?.map((color, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-green-100 px-3 py-1 rounded">
              {color}
              <button type="button" onClick={() => handleRemoveColor(idx)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Tags</label>
        <div className="flex gap-2 mb-2">
          <input type="text" value={tagInput} onChange={(e) => setTagInput(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" placeholder="Ajouter un tag" />
          <button type="button" onClick={handleAddTag} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            <Plus size={20} />
          </button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags?.map((tag, idx) => (
            <div key={idx} className="flex items-center gap-2 bg-purple-100 px-3 py-1 rounded">
              {tag}
              <button type="button" onClick={() => handleRemoveTag(idx)} className="text-red-600 hover:text-red-800">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition">
          <Upload className="mx-auto mb-2" size={32} />
          <span className="text-sm text-gray-600">Cliquez ou glissez-déposez des images</span>
          <input type="file" multiple accept="image/*" onChange={handleImageFileChange} className="hidden" />
        </div>

        <div className="flex gap-2 mt-4 mb-4">
          <input type="url" value={imageUrls} onChange={(e) => setImageUrls(e.target.value)} className="flex-1 p-2 border border-gray-300 rounded" placeholder="URL de l'image" />
          <button type="button" onClick={handleAddImageUrl} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
            Ajouter
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {formData.images?.map((img, idx) => (
            <div key={idx} className="relative group">
              <img src={'file' in img ? URL.createObjectURL(img.file as File) : img.url} alt={img.alt} className="w-full h-32 object-cover rounded" />
              <button type="button" onClick={() => handleRemoveImage(idx)} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded opacity-0 group-hover:opacity-100 transition">
                <X size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={formData.featured} onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))} className="w-4 h-4" />
          Produit en vedette
        </label>
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={formData.isActive} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))} className="w-4 h-4" />
          Actif
        </label>
      </div>

      <div className="flex gap-4 pt-4">
        <button type="submit" disabled={loading} className="flex-1 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:shadow-lg disabled:opacity-50">
          {loading ? 'Mise à jour en cours...' : 'Mettre à jour le produit'}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="flex-1 py-3 bg-gray-300 text-gray-800 rounded-lg font-semibold hover:bg-gray-400">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
};

export default EditProductForm;
