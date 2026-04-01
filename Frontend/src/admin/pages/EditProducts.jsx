import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getProductById, updateProduct } from '../../services/productService';

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    image: '',
    description: '',
    stock: '',
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const product = await getProductById(id);
      setFormData({
        name: product.name || '',
        brand: product.brand || '',
        price: product.price?.toString() || '',
        image: product.image || '',
        description: product.description || '',
        stock: product.stock?.toString() || '',
      });
      setImagePreview(product.image || '');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load product');
      navigate('/products');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (name === 'image') setImagePreview(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Product name is required');
      return;
    }
    if (!formData.price || isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.stock || isNaN(formData.stock) || parseInt(formData.stock) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    setUpdating(true);
    try {
      const payload = {
        name: formData.name,
        brand: formData.brand,
        price: parseFloat(formData.price),
        image: formData.image,
        description: formData.description,
        stock: parseInt(formData.stock),
      };
      await updateProduct(id, payload);
      toast.success('Product updated successfully');
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">Edit Product</h1>
          <p className="mt-1 text-sm text-gray-500">Update product details</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left column – image preview and upload */}
              <div>
                <div className="mt-1 flex justify-center  rounded-lg border  border-gray-300 bg-gray-50 overflow-hidden">
                  {imagePreview ? (
                      <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-72 w-full object-cover rounded-md "
                      />
                    ) : (
                        <div className="text-gray-400 text-sm">No image preview</div>
                    )}
                </div>
                <label className="block text-xs font-medium text-gray-400 px-1 mt-4 mb-1">Image URL </label>
                <input
                  type="text"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  placeholder="Image URL"
                  className=" p-4 outline-none block w-full rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm"
                />
              </div>

              {/* Right column – form fields */}
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
                    className="mb-5 block w-full p-2 outline-none rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="brand" className="block text-xs font-medium text-gray-400 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    id="brand"
                    name="brand"
                    value={formData.brand}
                    onChange={handleChange}
                    className="mb-5 block w-full p-2 outline-none rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                  />
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
                      className="mb-6 block w-full outline-none p-2 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="stock" className="block text-xs font-medium text-gray-400 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      id="stock"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      min="0"
                      className="mb-6 block w-full outline-none rounded-lg p-2 border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="description" className="block text-xs font-medium text-gray-400 mb-1">
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    rows="3"
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full outline-none p-4 rounded-lg border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 transition-colors resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Action buttons */}
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
                disabled={updating}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {updating ? 'Updating...' : 'Update Product'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProduct;