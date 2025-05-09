
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Eye, Search, Filter, ArrowUp, ArrowDown, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

type OrderType = {
  id: string;
  user_id: string;
  total_amount: number;
  status: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  shipping_country: string;
  created_at: string;
  payment_method: string;
  customer_email?: string;
  customer_name?: string;
};

const Orders: React.FC = () => {
  const [orders, setOrders] = useState<OrderType[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState({ field: 'created_at', direction: 'desc' });
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      setLoading(true);
      try {
        let query = supabase.from('orders').select('*');

        // Apply status filter if not 'all'
        if (filter !== 'all') {
          query = query.eq('status', filter);
        }

        // Apply search term if any
        if (searchTerm) {
          query = query.or(`shipping_address.ilike.%${searchTerm}%,shipping_zip.ilike.%${searchTerm}%`);
        }

        // Apply sorting
        query = query.order(sort.field, { ascending: sort.direction === 'asc' });

        const { data: orderData, error: orderError } = await query;

        if (orderError) throw orderError;

        // Get user profile data in a separate query
        if (orderData && orderData.length > 0) {
          const userIds = orderData.map(order => order.user_id).filter(Boolean);
          
          // Fetch profiles for these users
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, email, full_name')
            .in('id', userIds);
          
          if (profilesError) throw profilesError;
          
          // Map profile data to orders
          const ordersWithProfiles = orderData.map(order => {
            const userProfile = profilesData?.find(profile => profile.id === order.user_id);
            return {
              ...order,
              customer_email: userProfile?.email || 'Unknown',
              customer_name: userProfile?.full_name || 'Unknown Customer'
            };
          });
          
          setOrders(ordersWithProfiles);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user, filter, sort, searchTerm]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilter(e.target.value);
  };

  const handleSort = (field: string) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc'
    }));
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Search is already applied via useEffect dependency
  };

  const getSortIcon = (field: string) => {
    if (sort.field !== field) return null;
    return sort.direction === 'asc' ? <ArrowUp size={14} /> : <ArrowDown size={14} />;
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Orders</h1>
        <Button>
          <Download size={16} className="mr-2" /> Export
        </Button>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          {/* Search */}
          <form onSubmit={handleSearch} className="w-full md:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Search orders..."
                className="pl-10 pr-4 py-2 border rounded-md w-full md:w-64"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </form>

          {/* Filter */}
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <Filter size={16} className="mr-2 text-gray-500" />
              <span className="mr-2 text-gray-500">Filter:</span>
              <select
                className="border rounded-md px-3 py-2"
                value={filter}
                onChange={handleFilterChange}
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="processing">Processing</option>
                <option value="delivered">Delivered</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
            </div>
          ) : orders.length > 0 ? (
            <table className="w-full">
              <thead className="bg-gray-50 text-left">
                <tr>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('id')}>
                    <div className="flex items-center">
                      Order ID {getSortIcon('id')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('customer_name')}>
                    <div className="flex items-center">
                      Customer {getSortIcon('customer_name')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('created_at')}>
                    <div className="flex items-center">
                      Date {getSortIcon('created_at')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('total_amount')}>
                    <div className="flex items-center">
                      Amount {getSortIcon('total_amount')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('status')}>
                    <div className="flex items-center">
                      Status {getSortIcon('status')}
                    </div>
                  </th>
                  <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-medium">{order.id.slice(0, 8)}...</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="font-medium">{order.customer_name || 'Unknown'}</div>
                        <div className="text-sm text-gray-500">{order.customer_email || ''}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      ${order.total_amount.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeClass(order.status)}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link to={`/admin/orders/${order.id}`} className="text-tommyfx-blue flex items-center">
                        <Eye size={16} className="mr-1" /> View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No orders found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Orders;
