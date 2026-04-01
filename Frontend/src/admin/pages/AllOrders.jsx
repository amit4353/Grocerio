import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Search, Filter } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllOrders, updateOrderStatus } from '../../services/orderServices';

const AllOrders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllOrders(); // returns object of array of rows with order_id, status, total_price, user_name, email, product_name, quantity, price
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
            items: [],
          });
        }
        const order = ordersMap.get(row.order_id);
        order.items.push({
          product_name: row.product_name,
          quantity: row.quantity,
          price: row.price,
        });
        // Optionally recalc total if needed
        // order.total_price = order.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
      });
      const ordersArray = Array.from(ordersMap.values());
      // Sort latest first (assuming order_id is sequential)
      ordersArray.sort((a, b) => b.id - a.id);
      setOrders(ordersArray);
      setFilteredOrders(ordersArray);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      toast.success('Order status updated');
      // Refresh orders to reflect change
      fetchOrders();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update status');
    }
  };

  const handleSearch = () => {
    let filtered = orders;
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (order) =>
          order.id.toString().includes(term) ||
          order.user_name.toLowerCase().includes(term) ||
          order.email.toLowerCase().includes(term)
      );
    }
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status.toLowerCase() === statusFilter);
    }
    setFilteredOrders(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, statusFilter, orders]);

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
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Orders</h1>
          <p className="mt-1 text-sm text-gray-500">Manage customer orders</p>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="mt-6 flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border-gray-200 pl-9 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
        <div className="relative w-48">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="block w-full rounded-lg border-gray-200 pl-9 pr-8 py-2 text-sm focus:border-primary-500 focus:ring-primary-500 appearance-none"
          >
            <option value="all">All Status</option>
            <option value="pending">pending</option>
            <option value="confirmed">confirmed</option>
            <option value="shipped">shipped</option>
            <option value="delivered">delivered</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      </div>

      {/* Orders List */}
      <div className="mt-8 space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No orders found.</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            >
              {/* Order Header */}
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500">Order #{order.id}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{order.user_name} • {order.email}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="text-xs border border-gray-200 rounded-md px-2 py-1 bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
                  >
                    <option value="pending">pending</option>
                    <option value="confirmed">confirmed</option>
                    <option value="shipped">shipped</option>
                    <option value="delivered">delivered</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                  <button
                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                    className="p-1 text-gray-500 hover:text-primary-600 hover:scale-110 transition-all duration-200"
                  >
                    <Eye className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Order Items */}
              <div className="px-6 py-4">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50/50">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {order.items.map((item, idx) => (
                        <tr key={idx} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2 text-sm text-gray-800">{item.product_name}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">{item.quantity}</td>
                          <td className="px-4 py-2 text-sm text-gray-600">₹{item.price}</td>
                          <td className="px-4 py-2 text-sm font-medium text-gray-800">₹{item.price * item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr className="border-t border-gray-200 bg-gray-50/30">
                        <td colSpan="3" className="px-4 py-2 text-right text-sm font-medium text-gray-800">Total</td>
                        <td className="px-4 py-2 text-sm font-bold text-primary-600">₹{order.total_price}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AllOrders;