import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { getCart, removeFromCart, updateCartItem } from "../../services/cartServices";
import { checkout } from "../../services/orderServices";

const Cart = ({ loadCart }) => {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Redirect if not logged in
  useEffect(() => {
    if (!token) {
      navigate("/users/login");
    }
  }, [token, navigate]);

  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load cart items
  const loadCartItems = async () => {
    setLoading(true);
    try {
      const data = await getCart();
      setCart(data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load cart");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      window.scrollTo(0, 0);
      loadCartItems();
    }
  }, [token]);

  // Remove item
  const handleRemoveCart = async (id) => {
    try {
      const data = await removeFromCart(id);
      await loadCartItems(); // refresh list
      loadCart(); // refresh navbar cart count
      toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to remove item");
    }
  };

  // Update quantity with stock validation
  const handleUpdateCart = async (itemId, newQuantity) => {
    const item = cart.find((i) => i.id === itemId);
    if (!item) return;

    if (newQuantity < 1) return;

    // Check if requested quantity exceeds available stock
    if (newQuantity > item.stock) {
      toast.error(`Only ${item.stock} items available in stock`);
      return;
    }

    try {
      const data = await updateCartItem(itemId, newQuantity);
      await loadCartItems(); // refresh list
      // Optionally show success message
      // toast.success(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update quantity");
    }
  };

  const handleCheckout = async () => {
    try {
      const data = await checkout();
      toast.success(data?.message);
      navigate("/orders");
      loadCart(); // refresh navbar cart count
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to place order");
    }
  };

  // Calculate totals
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal >= 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 text-pri">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Looks like you haven't added anything yet.</p>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  // Main cart
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12 bg-gradient-to-b from-gray-50/50 to-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">Your Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Cart items */}
        <div className="flex-1 space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="group bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 ease-out hover:scale-[1.02] p-4 flex items-center gap-4"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-gray-800 truncate">{item.name}</h3>
                {item.brand && <p className="text-sm text-gray-500 mb-1">{item.brand}</p>}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xl font-bold text-primary-600">₹{item.price}</span>

                  {/* Quantity controls with stock limit */}
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => handleUpdateCart(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 transition-all duration-200 active:scale-90 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                      </svg>
                    </button>
                    <span className="w-8 text-center font-medium">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateCart(item.id, item.quantity + 1)}
                      disabled={item.quantity >= item.stock}
                      className="w-8 h-8 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:border-primary-500 hover:bg-primary-50 hover:text-primary-600 disabled:opacity-50 transition-all duration-200 active:scale-90 cursor-pointer"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </button>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={() => handleRemoveCart(item.id)}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors duration-200 cursor-pointer"
                    aria-label="Remove item"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>

                {/* Stock indicator */}
                {item.stock <= 5 && (
                  <p className="text-xs text-yellow-600 mt-1">
                    Only {item.stock} left in stock!
                  </p>
                )}
                {item.stock === 0 && (
                  <p className="text-xs text-red-600 mt-1">
                    Out of stock – please remove this item.
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Order summary */}
        <div className="lg:w-96">
          <div className="sticky top-24 bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Summary</h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-medium">₹{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Delivery Fee</span>
                <span className="font-medium">{deliveryFee === 0 ? "Free" : `₹${deliveryFee.toFixed(2)}`}</span>
              </div>
              <div className="border-t border-gray-200 my-3 pt-3 flex justify-between text-lg font-bold text-gray-800">
                <span>Total</span>
                <span className="text-primary-600">₹{total.toFixed(2)}</span>
              </div>
            </div>
            <button
              onClick={handleCheckout}
              className="w-full mt-6 px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
            >
              Proceed to Checkout
            </button>
            <p className="text-xs text-gray-400 text-center mt-4">Free delivery on orders above ₹500</p>
          </div>
        </div>
      </div>

      {/* Continue shopping */}
      <div className="mt-8 text-center lg:text-left">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center text-primary-600 hover:text-primary-700 font-medium transition-colors duration-200"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default Cart;