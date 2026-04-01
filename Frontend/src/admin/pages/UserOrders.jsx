import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { getOrderById } from '../../services/orderServices'; // adjust import

const OrderDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrderDetails();
  }, [id]);

  const fetchOrderDetails = async () => {
    setLoading(true);
    try {
      const data = await getOrderById(id); // returns array of order items
      // Group by order_id – but it's a single order, so just store the first item's common fields
      console.log("Data" , data);
      if (data && data.length > 0) {
        const orderInfo = {
          id: data[0].order_id,
          status: data[0].status,
          total_price: data[0].total_price,
          items: data.map(item => ({
            name: item.name,
            brand: item.brand,
            description: item.description,
            quantity: item.quantity,
            price: item.price,
            image: item.image,
          })),
        };
        setOrder(orderInfo);
      } else {
        setOrder(null);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load order');
      setOrder(null);
    } finally {
      setLoading(false);
    }
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
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-center max-w-md">
          <div className="mb-6 flex justify-center">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center">
              <svg className="w-16 h-16 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Order not found</h2>
          <p className="text-gray-500 mb-6">The order you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/admin/orders/users/order')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            Back to Orders
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/admin/orders/users/order')}
            className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary-600 transition-colors mb-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Orders
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">Order Details</h1>
          <p className="text-sm text-gray-500 mt-1">View your order information</p>
        </div>

        {/* Order Summary Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-sm text-gray-500">Order ID</p>
              <p className="text-lg font-medium text-gray-900">#{order.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Order Status</p>
              <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Amount</p>
              <p className="text-2xl font-bold text-primary-600">₹{order.total_price}</p>
            </div>
          </div>
        </div>

        {/* Products List */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-semibold text-gray-800">Order Items</h2>
          </div>
          <div className="divide-y divide-gray-100">
            {order.items.map((item, idx) => (
              <div key={idx} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2">
                      <div>
                        <h3 className="text-base font-semibold text-gray-800">{item.name}</h3>
                        <p className="text-sm text-gray-500 mt-0.5">{item.brand}</p>
                        <p className="text-xs text-gray-400 mt-1 line-clamp-2">{item.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                        <p className="text-base font-semibold text-gray-800 mt-1">₹{item.price * item.quantity}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end">
            <div className="text-right">
              <p className="text-sm text-gray-500">Total</p>
              <p className="text-2xl font-bold text-primary-600">₹{order.total_price}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetails;