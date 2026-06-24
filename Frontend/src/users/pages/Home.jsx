import React, { useEffect, useState } from 'react';
import { getProducts } from '../../services/productService';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { addToCart } from '../../services/cartServices';
import toast from 'react-hot-toast';

const Home = ({ loadCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentFeaturedIndex, setCurrentFeaturedIndex] = useState(0);
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search")?.toLowerCase() || "";

  const isSearching = searchQuery.length > 0;

  useEffect(() => {
    if (searchQuery) {
      setTimeout(() => {
        document.getElementById("shop")?.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 100);
    }
  }, [searchQuery]);

  const loadProducts = async () => {
    try {
      setLoading(true);

      const data = await getProducts();

      setProducts(data || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const filteredProducts = products.filter((product) => {
    return (
      product.name.toLowerCase().includes(searchQuery) ||
      product.brand.toLowerCase().includes(searchQuery)
    );
  });

  // Get top 5 most expensive products
  const topProducts = [...products]
    .sort((a, b) => b.price - a.price)
    .slice(0, 5);

  const currentProduct = topProducts[currentFeaturedIndex];

  const nextFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev + 1) % topProducts.length);
  };
  const prevFeatured = () => {
    setCurrentFeaturedIndex((prev) => (prev - 1 + topProducts.length) % topProducts.length);
  };

  // Extract unique brands for brands section
  const uniqueBrands = [...new Set(products.map((p) => p.brand))].slice(0, 6);

  const handleAddToCart = async (productId, currentStock) => {
    if (currentStock <= 0) {
      toast.error('Out of stock!');
      return;
    }
    try {
      const res = await addToCart({
        product_id: productId,
        quantity: 1,
      });
      loadCart();
      toast.success(res?.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

    useEffect(() => {
      loadProducts();
      window.scrollTo(0, 0);
    }, []);

  return (
    <main className="animate-fadeIn">

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-hero py-12 md:py-20 lg:py-28">
        <div className="absolute top-0 left-0 w-48 md:w-72 h-48 md:h-72 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float"></div>
        <div className="absolute top-0 right-0 w-48 md:w-72 h-48 md:h-72 bg-accent-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-48 md:w-72 h-48 md:h-72 bg-primary-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float animation-delay-4000"></div>

        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-4 md:mb-6 bg-gradient-to-r from-primary-700 to-accent-600 bg-clip-text text-transparent animate-fadeInUp animation-delay-100">
            Fresh Groceries Delivered <br />to Your Doorstep
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 md:mb-10 max-w-2xl mx-auto animate-fadeInUp animation-delay-200">
            Shop the finest organic produce, dairy, and pantry essentials – all with fast, free delivery.
          </p>
          <a href="#shop">
            <button className="inline-flex items-center justify-center px-6 md:px-8 py-3 md:py-4 rounded-full bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium text-base md:text-lg hover:from-primary-600 hover:to-primary-700 hover:shadow-xl hover:scale-105 transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 animate-fadeInUp animation-delay-300">
              Shop Now
            </button>
          </a>
        </div>
      </section>

      {/* Featured Product Spotlight*/}
      {topProducts.length > 0 && (
        <section className="bg-white animate-fadeInUp animation-delay-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="bg-gradient-to-r from-primary-50 to-accent-50 rounded-2xl md:rounded-3xl p-4 md:p-8 lg:p-12">

              <div className="overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                <div className="flex gap-4 md:gap-8">
                  {topProducts.map((product) => (
                    <div
                      key={product.id}
                      className="flex-shrink-0 w-full snap-start"
                    >
                      <div className="grid md:grid-cols-2 gap-6 md:gap-8 items-center">
                        {/* Image */}
                        <div className="relative h-[250px] md:h-[350px] lg:h-[400px] cursor-pointer">
                          <img
                            src={product.image}
                            alt={product.name}
                            onClick={() => navigate(`/products/${product.id}`)}
                            className="w-full h-full object-cover rounded-xl md:rounded-2xl"
                          />
                        </div>
                        {/* Content */}
                        <div className="flex flex-col justify-center pl-4 md:pl-8 lg:pl-16">
                          <span className={`text-xs font-medium py-1 md:py-2 ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                          </span>
                          <span className="text-xs md:text-sm font-semibold text-primary-600 uppercase tracking-wider">Featured</span>
                          <h2 className="text-xl md:text-3xl lg:text-4xl font-bold text-gray-800 mt-2 mb-2 md:mb-4">{product.name}</h2>
                          <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4">{product.brand}</p>
                          <p className="text-sm md:text-base text-gray-500 mb-4 md:mb-6">{product.description}</p>
                          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
                            <span className="text-2xl md:text-3xl font-bold text-primary-600">₹{product.price}</span>
                            {product.stock > 0 ? (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleAddToCart(product.id, product.stock);
                                }}
                                className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 text-white font-medium text-sm md:text-base hover:from-accent-600 hover:to-accent-700 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
                              >
                                Add to Cart
                              </button>
                            ) : (
                              <button
                                disabled
                                className="px-4 md:px-6 py-2 md:py-3 rounded-xl bg-gray-300 text-gray-500 cursor-not-allowed text-sm md:text-base"
                              >
                                Out of Stock
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Carousel dots for mobile */}
              <div className="flex justify-center gap-2 mt-4 md:hidden">
                {topProducts.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      const container = document.querySelector('.overflow-x-auto');
                      if (container) {
                        const scrollAmount = container.clientWidth * idx;
                        container.scrollTo({ left: scrollAmount, behavior: 'smooth' });
                      }
                    }}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentFeaturedIndex ? 'w-6 bg-primary-500' : 'w-1.5 bg-gray-300'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Popular Brands Section */}
      {uniqueBrands.length > 0 && (
        <section className="py-12 md:py-16 bg-gray-50/50 animate-fadeInUp animation-delay-200">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">Popular Brands</h2>
            <div className="flex flex-wrap justify-center gap-3 md:gap-8">
              {uniqueBrands.map((brand, idx) => (
                <div
                  key={idx}
                  className="px-4 md:px-6 py-2 md:py-3 bg-white rounded-full shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 cursor-default"
                >
                  <span className="text-sm md:text-lg font-medium text-gray-700">{brand}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Why Choose Grocerio */}
      <section className="py-12 md:py-16 bg-white animate-fadeInUp animation-delay-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-8 md:mb-12">Why Grocerio?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Farm Fresh</h3>
              <p className="text-sm md:text-base text-gray-500">Directly sourced from local farms, delivered within 24 hours.</p>
            </div>
            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-accent-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-accent-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Quick Delivery</h3>
              <p className="text-sm md:text-base text-gray-500">Free express delivery on orders above ₹499.</p>
            </div>
            <div className="text-center p-4 md:p-6 rounded-2xl hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-primary-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 md:w-8 md:h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg md:text-xl font-semibold mb-2">Quality Guarantee</h3>
              <p className="text-sm md:text-base text-gray-500">100% satisfaction or your money back.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Fresh Picks Section */}
      <section className="py-12 md:py-20 bg-gray-50/50" id="shop">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-baseline justify-between mb-8 md:mb-12 animate-fadeInUp animation-delay-100">
            <div>
              <h2 className="text-2xl md:text-4xl font-bold text-gray-800 tracking-tight">
                {searchQuery
                  ? `Search Results for "${searchQuery}"`
                  : "Fresh Picks"}
              </h2>
              <p className="text-sm md:text-base text-gray-500 mt-2">Farm fresh, delivered to your door</p>
            </div>
            <span className="mt-2 sm:mt-0 px-3 md:px-4 py-1 md:py-2 text-xs md:text-sm bg-white/80 backdrop-blur-sm border border-gray-200 rounded-full text-gray-600 shadow-sm self-start sm:self-auto">
              {filteredProducts.length} products
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {[...Array(8)].map((_, index) => (
                <div
                  key={index}
                  className="bg-white rounded-2xl shadow-md p-4 animate-pulse"
                >
                  <div className="h-40 bg-gray-200 rounded-xl"></div>

                  <div className="h-4 bg-gray-200 rounded mt-4"></div>

                  <div className="h-4 bg-gray-200 rounded mt-2 w-2/3"></div>

                  <div className="h-8 bg-gray-200 rounded mt-4"></div>
                </div>
              ))}
            </div>
            ) : filteredProducts.length === 0 ? (
              <p className="text-center text-gray-500 animate-fadeInUp">
                No products found
              </p>
            ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  onClick={() => navigate(`/products/${product.id}`)}
                  className="group w-full max-w-sm mx-auto bg-white rounded-2xl shadow-md hover:shadow-xl transition-transform duration-300 ease-in-out hover:scale-[1.02] cursor-pointer overflow-hidden animate-fadeInUp"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="relative overflow-hidden h-40 sm:h-48 bg-gray-100">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ease-in-out"
                    />
                  </div>
                  <div className="p-3 md:p-4">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-1">{product.name}</h3>
                    <p className="text-xs md:text-sm text-gray-500 mb-2 md:mb-3 pr-5 flex items-center justify-between">
                      {product.brand}
                      <span className={`text-xs font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
                      </span>
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-lg md:text-xl font-bold text-primary-600">₹{product.price}</span>
                      {product.stock > 0 ? (
                        <button
                          onClick={(e) => {
                            handleAddToCart(product.id, product.stock);
                            e.stopPropagation();
                          }}
                          className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gradient-to-r from-accent-500 to-accent-600 text-white text-xs md:text-sm font-medium hover:from-accent-600 hover:to-accent-700 hover:shadow-md hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-2 focus:ring-accent-500 focus:ring-offset-2 cursor-pointer"
                        >
                          Add to Cart
                        </button>
                      ) : (
                        <button
                          disabled
                          className="px-3 md:px-4 py-1.5 md:py-2 rounded-lg bg-gray-300 text-gray-500 text-xs md:text-sm font-medium cursor-not-allowed"
                        >
                          Out of Stock
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Newsletter Signup */}
      <section className="py-12 md:py-16 bg-gray-100/90 animate-fadeInUp animation-delay-200">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-2xl md:text-3xl text-black/50 font-bold mb-3 md:mb-4">Get Fresh Updates</h2>
          <p className="text-sm md:text-base mb-6 md:mb-8 text-black/50">Subscribe to receive exclusive offers and fresh produce news.</p>
          <form className="flex flex-col sm:flex-row gap-3 md:gap-4 max-w-md mx-auto">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 md:px-6 py-2 md:py-3 rounded border border-gray-400/50 focus:border-none focus:placeholder:text-gray-500 placeholder:text-accent-500 focus:ring-2 focus:ring-white focus:outline-green-600 text-sm md:text-base"
            />
            <button
              type="submit"
              className="px-6 md:px-8 py-2 md:py-3 rounded text-white bg-primary-600 font-medium hover:scale-105 transition-transform duration-300 ease-in-out cursor-pointer text-sm md:text-base"
            >
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default Home;