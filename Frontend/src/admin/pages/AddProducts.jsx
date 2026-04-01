import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { createProduct } from '../../services/productService';

const AddProduct = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    image: '',
    description: '',
    stock: '',
  });
  const [imagePreview, setImagePreview] = useState('');
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'image') setImagePreview(value);
    // Clear field error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Product name is required';
    if (!formData.brand.trim()) newErrors.brand = 'Brand is required';
    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Valid price is required';
    }
    if (!formData.image.trim()) newErrors.image = 'Image URL is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setLoading(true);
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
        stock: formData.stock ? parseInt(formData.stock) : 0,
      };
      await createProduct(payload);
      toast.success('Product created successfully');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Add Product</h1>
          <p className="mt-1 text-sm text-gray-500">Create a new product for your store</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column – Image Preview */}
              <div>

                <div className="mt-1 flex justify-center rounded-lg border border-gray-300 bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-72 w-full object-cover rounded-md"
                    />
                  ) : (
                    <div className="text-gray-400 py-33.5">Image preview will appear here</div>
                  )}
                </div>
                <label className="block text-xs font-medium text-gray-400 px-1 mt-4 mb-1">Image URL </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Enter image URL"
                  className={`p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm ${
                    errors.image ? 'border-red-500' : ''
                  }`}
                />
                {errors.image && (
                  <p className="mt-1 text-xs text-red-600">{errors.image}</p>
                )}
              </div>

              {/* Right column – Form fields */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-xs font-medium text-gray-400 mb-1">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={`p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors ${
                      errors.name ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.name && <p className="mt-1 text-xs text-red-600">{errors.name}</p>}
                </div>

                <div>
                  <label htmlFor="brand" className="block text-xs font-medium text-gray-400 mb-1">
                    Brand *
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className={`p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors ${
                      errors.brand ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.brand && <p className="mt-1 text-xs text-red-600">{errors.brand}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="price" className="block text-xs font-medium text-gray-400 mb-1">
                      Price (₹) *
                    </label>
                    <input
                      type="number"
                      id="price"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      step="0.01"
                      min="0"
                      className={`p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors ${
                        errors.price ? 'border-red-500' : ''
                      }`}
                    />
                    {errors.price && <p className="mt-1 text-xs text-red-600">{errors.price}</p>}
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-xs font-medium text-gray-400 mb-1">
                      Stock (optional)
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="p-2 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                    />
                    <p className="mt-1 text-xs text-gray-400">Default 0 if left empty</p>
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1">
                    Description *
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className={`p-4 block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors resize-none ${
                      errors.description ? 'border-red-500' : ''
                    }`}
                  />
                  {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description}</p>}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={() => navigate('/products')}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Add Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;