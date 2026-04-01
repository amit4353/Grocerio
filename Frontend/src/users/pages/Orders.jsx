import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { getUserOrders, cancelOrder } from '../../services/orderServices';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();

  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await getUserOrders();
      const rows = response.data;
      console.log(rows)
      const ordersMap = new Map();
      rows.forEach((row) => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            id: row.order_id,
            status: row.status,
            total_price: row.total_price,
            items: [],
          });
        }
        const order = ordersMap.get(row.order_id);
        order.items.push({
          name: row.product_name,
          quantity: row.quantity,
          price: row.price,
        });
      });
      const ordersArray = Array.from(ordersMap.values());
      // Latest first (assuming id is sequential and higher means newer)
      ordersArray.sort((a, b) => b.id - a.id);
      setOrders(ordersArray);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId);
    setShowModal(true);
  };

  const confirmCancel = async () => {
    if (!selectedOrderId) return;
    setCancelLoading(true);
    try {
      await cancelOrder(selectedOrderId);
      toast.success('Order cancelled successfully');
      // Update local order status
      setOrders((prevOrders) =>
        prevOrders.map((order) =>
          order.id === selectedOrderId ? { ...order, status: 'cancelled' } : order
        )
      );
      setShowModal(false);
      setSelectedOrderId(null);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to cancel order';
      toast.error(msg);
    } finally {
      setCancelLoading(false);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedOrderId(null);
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'processing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'delivered':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary-500 border-r-transparent"></div>
          <p className="mt-4 text-gray-500">Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h2>
          <p className="text-gray-500 mb-6">Start shopping to see your orders here.</p>
          <button
            onClick={() => navigate('/')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Start Shopping
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50/50 to-white py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800">Your Orders</h1>
          <p className="text-gray-500 mt-2">Track and manage your purchases</p>
        </div>

        <div className="space-y-6">
          {orders.map((order) => {
            const isCancelable = order.status === 'pending' || order.status === 'processing' || order.status === 'confirmed';
            return (
              <div
                key={order.id}
                className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:scale-[1.01] overflow-hidden"
              >
                <div className="border-b border-gray-100 px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50/50">
                  <div>
                    <p className="text-sm text-gray-500">Order #{order.id}</p>
                    <p className="text-xs text-gray-400">Placed recently</p>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                      {order.status}
                    </span>
                    <span className="text-lg font-semibold text-gray-800">₹{order.total_price}</span>
                    {isCancelable && (
                      <button
                        onClick={() => handleCancelClick(order.id)}
                        disabled={cancelLoading}
                        className="px-3 py-1 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-medium hover:from-red-600 hover:to-red-700 hover:shadow-md hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel Order
                      </button>
                    )}
                  </div>
                </div>

                <div className="px-6 py-4">
                  <div className="space-y-4">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-4">
                        {/* Placeholder image – in real use you'd have item.image */}
                        <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 flex-shrink-0">
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400 text-xs">
                            <img src={item.image} alt={item.name} />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-800">{item.name}</h4>
                          <p className="text-sm text-gray-500">
                            ₹{item.price} × {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">₹{item.price * item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {order.status === 'pending' && (
                    <p className="text-xs text-yellow-600 mt-3 flex items-center gap-1">
                      ⚠️ Orders can only be cancelled before delivery.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-scaleIn">
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Cancel Order?</h3>
            <p className="text-gray-500 mb-6">
              Are you sure you want to cancel this order? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={closeModal}
                disabled={cancelLoading}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
              >
                No, Keep Order
              </button>
              <button
                onClick={confirmCancel}
                disabled={cancelLoading}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-red-500 to-red-600 text-white font-medium hover:from-red-600 hover:to-red-700 shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all disabled:opacity-50"
              >
                {cancelLoading ? 'Cancelling...' : 'Yes, Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(-10px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        .animate-scaleIn {
          animation: scaleIn 0.2s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Orders;