import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getProductById } from '../../services/productService';
import toast from 'react-hot-toast';
import { addToCart } from '../../services/cartServices';

const ProductDetails = ({ loadCart }) => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProduct();
    window.scrollTo(0, 0);
  }, [id]);

  const loadProduct = async () => {
    setLoading(true);
    try {
      const res = await getProductById(id);
      setProduct(res);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const AddToCart = async () => {
    try {
      const res = await addToCart({ product_id: id, quantity: qty });
      toast.success(res?.message);
      loadCart();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Something went wrong');
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50/50 to-white">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading product...</p>
        </div>
      </div>
    );
  }

  // Not found state
  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 bg-gradient-to-b from-gray-50/50 to-white">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Product not found</h2>
          <p className="text-gray-500 mb-6">The product you're looking for doesn't exist or has been removed.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  const total = (qty * parseFloat(product.price)).toFixed(0);
  const maxQty = product.stock || 0; // fallback to 0 if stock missing

  // Quantity handlers with stock limit
  const increaseQty = () => {
    if (qty < maxQty) setQty(q => q + 1);
    else if (maxQty > 0) toast.error(`Only ${maxQty} items available`);
  };

  const decreaseQty = () => {
    if (qty > 1) setQty(q => q - 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          {/* Back button */}
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full mb-8 hover:border-primary-300 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-primary-600 hover:border-none hover:scale-105"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to products
          </button>

          {/* Cart button */}
          <button
            onClick={() => navigate('/cart')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-white bg-white/80 backdrop-blur-sm border border-gray-200 px-4 py-2 rounded-full mb-8 hover:border-primary-300 hover:shadow-md transition-all duration-300 cursor-pointer hover:bg-primary-600 hover:border-none hover:scale-105"
          >
            Go to Cart
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Image Section */}
          <div className="relative group">
            <div className="rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-xl transition-all duration-300">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[440px] object-cover group-hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>

          {/* Product Info Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-6 md:p-8 border border-white/20">
            {/* Badge and wishlist */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs text-green-700 bg-green-50 border border-green-200 px-3 py-1 rounded-full">
                Organic
              </span>
              <button className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 text-gray-400 hover:text-red-400 transition-colors duration-200">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </button>
            </div>

            {/* Product name & brand */}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{product.name}</h1>
            <p className="text-sm text-gray-500 mb-4">by {product.brand}</p>

            <hr className="border-gray-200 mb-5" />

            {/* Price */}
            <div className="flex items-baseline gap-2 mb-5">
              <span className="text-4xl font-bold text-primary-600">₹{product.price}</span>
              <span className="text-sm text-gray-400">per kg</span>
            </div>

            {/* Description */}
            <p className="text-xs text-gray-400 uppercase tracking-widest mb-2">About this product</p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            {/* Meta Information - Updated with stock */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">Brand</p>
                <p className="text-sm font-medium text-gray-800">{product.brand}</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">Category</p>
                <p className="text-sm font-medium text-gray-800">Fruits</p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">Availability</p>
                <p className={`text-sm font-medium ${maxQty > 0 ? 'text-green-700' : 'text-red-600'}`}>
                  {maxQty > 0 ? `${maxQty} in stock` : 'Out of stock'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-3 shadow-sm">
                <p className="text-xs text-gray-400 mb-1">Added on</p>
                <p className="text-sm font-medium text-gray-800">
                  {new Date(product.created_at).toLocaleDateString('en-IN')}
                </p>
              </div>
            </div>

            {/* Quantity Selector - with stock limit */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm text-gray-600 font-medium">Quantity</span>
              <div className="flex items-center border border-gray-200 rounded-full bg-white shadow-sm">
                <button
                  onClick={decreaseQty}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-l-full transition-colors duration-200 disabled:opacity-50"
                  disabled={qty <= 1}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                  </svg>
                </button>
                <span className="text-sm font-semibold px-4 min-w-[40px] text-center">{qty}</span>
                <button
                  onClick={increaseQty}
                  className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary-600 hover:bg-primary-50 rounded-r-full transition-colors duration-200 disabled:opacity-50"
                  disabled={qty >= maxQty || maxQty === 0}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </button>
              </div>
              <span className="text-sm text-gray-500">
                Total: <span className="font-semibold text-primary-600">₹{total}</span>
              </span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={AddToCart}
                disabled={maxQty === 0}
                className={`flex-1 text-sm font-medium py-3 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 ${
                  maxQty === 0
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'border border-gray-200 bg-white hover:bg-gray-50 text-gray-800'
                }`}
              >
                {maxQty === 0 ? 'Out of Stock' : 'Add to Cart'}
              </button>
              <button
                className={`flex-1 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white text-sm font-medium py-3 rounded-xl shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 ${
                  maxQty === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
                disabled={maxQty === 0}
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;