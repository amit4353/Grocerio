import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Trash2, Search } from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllUsers, deleteUser } from '../../services/userServices';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const data = await getAllUsers();
      console.log(" user data" , data);
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setFilteredUsers(users);
      return;
    }
    const term = searchTerm.toLowerCase();
    const filtered = users.filter(
      (user) =>
        user.name.toLowerCase().includes(term) ||
        user.email.toLowerCase().includes(term)
    );
    setFilteredUsers(filtered);
  };

  useEffect(() => {
    handleSearch();
  }, [searchTerm, users]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(id);
        toast.success('User deleted successfully');
        fetchUsers(); // refresh
      } catch (err) {
        toast.error(err.response?.data?.message || 'Failed to delete user');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <p className="mt-4 text-gray-500">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">All Users</h1>
          <p className="mt-1 text-sm text-gray-500">Manage your users</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mt-6 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full rounded-lg border-gray-200 pl-9 pr-4 py-2 text-sm placeholder:text-gray-400 focus:border-primary-500 focus:ring-primary-500"
          />
        </div>
      </div>

      {/* Users Table */}
      <div className="mt-8 overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
        {filteredUsers.length === 0 ? (
          <div className="py-12 text-center">
            <p className="text-gray-500">No users found.</p>
          </div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  ID
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Address
                </th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
               </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors duration-200"
                >
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {user.id}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                    {user.name}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {user.email}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                    {user.phone_number || '—'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                    {user.address || '—'}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-right text-sm font-medium">
                    <button
                      onClick={() => navigate(`/admin/users/${user.id}`)}
                      className="inline-flex items-center gap-1 text-gray-500 hover:text-primary-600 transition-colors mr-3"
                    >
                      <Eye className="h-4 w-4" />
                      <span className="sr-only">View</span>
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="inline-flex items-center gap-1 text-gray-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Users;