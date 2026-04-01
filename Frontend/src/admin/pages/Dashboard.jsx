import { ShoppingBag, DollarSign, Users, Package, Clock, PlusCircle, Eye, UserPlus, AlertTriangle } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// Dummy data
const stats = [
  {
    title: 'Total Orders',
    value: '1,284',
    change: '+12.3%',
    icon: ShoppingBag,
    color: 'text-primary-600',
    bg: 'bg-primary-50',
  },
  {
    title: 'Total Revenue',
    value: '₹48,293',
    change: '+18.7%',
    icon: DollarSign,
    color: 'text-emerald-600',
    bg: 'bg-emerald-50',
  },
  {
    title: 'Total Users',
    value: '3,421',
    change: '+8.2%',
    icon: Users,
    color: 'text-blue-600',
    bg: 'bg-blue-50',
  },
  {
    title: 'Total Products',
    value: '342',
    change: '+5.4%',
    icon: Package,
    color: 'text-purple-600',
    bg: 'bg-purple-50',
  },
  {
    title: 'Pending Orders',
    value: '23',
    change: '-2.1%',
    icon: Clock,
    color: 'text-orange-600',
    bg: 'bg-orange-50',
  },
];

const revenueData = [
  { day: 'Mon', revenue: 4200 },
  { day: 'Tue', revenue: 3800 },
  { day: 'Wed', revenue: 5100 },
  { day: 'Thu', revenue: 4700 },
  { day: 'Fri', revenue: 6800 },
  { day: 'Sat', revenue: 7200 },
  { day: 'Sun', revenue: 5900 },
];

const recentOrders = [
  {
    id: 'ORD-001',
    customer: 'John Doe',
    amount: 1299,
    status: 'Delivered',
    date: '2025-03-20',
  },
  {
    id: 'ORD-002',
    customer: 'Jane Smith',
    amount: 849,
    status: 'Processing',
    date: '2025-03-21',
  },
  {
    id: 'ORD-003',
    customer: 'Mike Johnson',
    amount: 2450,
    status: 'Pending',
    date: '2025-03-21',
  },
  {
    id: 'ORD-004',
    customer: 'Sarah Williams',
    amount: 560,
    status: 'Delivered',
    date: '2025-03-19',
  },
  {
    id: 'ORD-005',
    customer: 'David Brown',
    amount: 1799,
    status: 'Processing',
    date: '2025-03-20',
  },
];

const lowStockProducts = [
  { name: 'Organic Milk', stock: 2, unit: 'bottles' },
  { name: 'Whole Wheat Bread', stock: 0, unit: 'loaves' },
  { name: 'Free Range Eggs', stock: 5, unit: 'dozen' },
  { name: 'Fresh Strawberries', stock: 3, unit: 'boxes' },
];

const getStatusColor = (status) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'bg-green-100 text-green-800';
    case 'processing':
      return 'bg-blue-100 text-blue-800';
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'cancelled':
      return 'bg-red-100 text-red-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};


const StatCard = ({ title, value, change, icon: Icon, color, bg }) => (
  <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] p-6 border border-gray-100">
    <div className="flex items-center justify-between mb-4">
      <div className={`p-3 rounded-lg ${bg}`}>
        <Icon className={`h-6 w-6 ${color}`} />
      </div>
      <span className={`text-sm font-medium ${change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
        {change}
      </span>
    </div>
    <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
    <p className="text-sm text-gray-500 mt-1">{title}</p>
  </div>
);

const Dashboard = () => {
  
  useEffect(() => {
    window.scrollTo(0, 0);
  },[]);
  
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      {/* Chart & Quick Actions Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6 border-gray-100">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <span className="text-xs text-gray-400">Last 7 days</span>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%" className="">
              <LineChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="day" stroke="#9ca3af" fontSize={12} />
                <YAxis
                  tickFormatter={(value) => `₹${value}`}
                  stroke="#9ca3af"
                  fontSize={12}
                />
                <Tooltip
                  formatter={(value) => [`₹${value}`, 'Revenue']}
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '0.5rem',
                    fontSize: '12px',
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  dot={{ fill: '#10b981', strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button onClick={() => navigate('/products/add')} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="flex items-center gap-3">
                <PlusCircle className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-700">Add Product</span>
              </span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate('/admin/orders/users/order')} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="flex items-center gap-3">
                <Eye className="h-5 w-5 text-primary-600" />
                <span className="font-medium text-gray-700">View Orders</span>
              </span>
              <span className="text-gray-400">→</span>
            </button>
            <button onClick={() => navigate('/admin/users')} className="w-full flex items-center justify-between px-4 py-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors">
              <span className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-primary-600" />
                <span  className="font-medium text-gray-700">Manage Users</span>
              </span>
              <span className="text-gray-400">→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Recent Orders & Low Stock */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{order.customer}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-medium">
                      ₹{order.amount}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                          order.status
                        )}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.date).toLocaleDateString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gradient-to-r from-yellow-50 to-white">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <h3 className="text-lg font-semibold text-gray-800">Low Stock Alerts</h3>
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {lowStockProducts.map((product, idx) => (
              <div key={idx} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      Only {product.stock} {product.unit} left
                    </p>
                  </div>
                  {product.stock === 0 ? (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
                      Out of stock
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Low stock
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-3 bg-gray-50 border-t border-gray-100">
            <button onClick={() => navigate('/products')} className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View all products →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;