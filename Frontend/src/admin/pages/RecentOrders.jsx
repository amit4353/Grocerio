import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllOrders } from '../../services/orderServices';

const RecentOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(); // returns array of order rows
      // Group by order_id

      const ordersMap = new Map();
      data.orders.forEach((row) => {
        if (!ordersMap.has(row.order_id)) {
          ordersMap.set(row.order_id, {
            id: row.order_id,
            status: row.status,
            total_price: row.total_price,
            user_name: row.user_name,
            email: row.email,
          });
        }
        // No need to store items for this widget, we just need the order summary
      });
      const ordersArray = Array.from(ordersMap.values());
      // Latest first (assuming backend already sorted by created_at desc)
      // but if not, we sort by id descending (latest order_id highest)
      ordersArray.sort((a, b) => b.id - a.id);
      // Take first 5
      setOrders(ordersArray.slice(0, 5));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
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
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-center py-8">
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
        <button
          onClick={() => navigate('/admin/orders/users/order')}
          className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 transition-colors"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>

      <div className="divide-y divide-gray-100">
        {orders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No recent orders
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className={`px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                index === 0 ? 'bg-gradient-to-r from-primary-50/30 to-transparent' : ''
              }`}
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  <span className="text-sm text-gray-600">{order.user_name}</span>
                </div>
                <div className="mt-1">
                  <span className={`inline-flex px-2 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold text-gray-800">₹{order.total_price}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RecentOrders;