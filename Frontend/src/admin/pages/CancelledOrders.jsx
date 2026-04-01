import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllOrders } from '../../services/orderServices';

const CancelledOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCancelledOrders();
  }, []);

  const fetchCancelledOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(); // array of rows
      // Group by order_id
      const ordersMap = new Map();
      data.orders.forEach((row) => {
        // Only consider cancelled orders
        if (row.status.toLowerCase() === 'cancelled') {
          if (!ordersMap.has(row.order_id)) {
            ordersMap.set(row.order_id, {
              id: row.order_id,
              status: row.status,
              total_price: row.total_price,
              user_name: row.user_name,
              email: row.email,
            });
          }
        }
      });
      const ordersArray = Array.from(ordersMap.values());
      // Sort latest first (assuming order_id is incremental, higher id = newer)
      ordersArray.sort((a, b) => b.id - a.id);
      // Take first 5
      setOrders(ordersArray.slice(0, 5));
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
      setOrders([]);
    } finally {
      setLoading(false);
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
    <div className="bg-white rounded-xl shadow-sm border border-red-100 overflow-hidden">
      <div className="px-6 py-4 border-b border-red-100 bg-gradient-to-r from-red-50 to-white">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold text-gray-800">Cancelled Orders</h3>
            <p className="text-xs text-gray-500 mt-0.5">Recently cancelled orders</p>
          </div>
        </div>
      </div>

      <div className="divide-y divide-red-50">
        {orders.length === 0 ? (
          <div className="px-6 py-8 text-center text-gray-500">
            No cancelled orders
          </div>
        ) : (
          orders.map((order, index) => (
            <div
              key={order.id}
              className="px-6 py-4 flex items-center justify-between hover:bg-red-50/30 transition-colors"
            >
              <div className="flex-1">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-900">#{order.id}</span>
                  <span className="text-sm text-gray-600">{order.user_name}</span>
                </div>
                <div className="mt-1">
                  <span className="inline-flex px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                    Cancelled
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

export default CancelledOrders;