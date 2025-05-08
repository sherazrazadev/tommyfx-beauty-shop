
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, Package } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

// Types
interface StatsType {
  totalOrders: number;
  totalRevenue: number;
  productsSold: number;
  recentOrders: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsType>({
    totalOrders: 0,
    totalRevenue: 0,
    productsSold: 0,
    recentOrders: []
  });
  
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  
  // Mock data for chart
  const salesData = [
    { name: 'Monday', sales: 4000 },
    { name: 'Tuesday', sales: 3000 },
    { name: 'Wednesday', sales: 5000 },
    { name: 'Thursday', sales: 2780 },
    { name: 'Friday', sales: 6890 },
    { name: 'Saturday', sales: 4390 },
    { name: 'Sunday', sales: 3490 }
  ];

  useEffect(() => {
    if (!user) return;

    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Get total orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_amount, created_at, profiles(full_name, email)');
        
        if (ordersError) throw ordersError;

        // Get total products sold (sum of quantities from order_items)
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('quantity');
        
        if (itemsError) throw itemsError;

        // Calculate stats
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0) || 0;
        const productsSold = orderItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        
        // Get latest 5 orders
        const recentOrders = orders?.sort((a: any, b: any) => {
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        }).slice(0, 5) || [];

        setStats({
          totalOrders,
          totalRevenue,
          productsSold,
          recentOrders
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <span className="text-sm text-gray-500">Welcome, Admin</span>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full mr-4">
              <ShoppingBag size={24} className="text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Orders</p>
              <h3 className="text-2xl font-bold">{stats.totalOrders}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full mr-4">
              <DollarSign size={24} className="text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Total Revenue</p>
              <h3 className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-orange-100 p-3 rounded-full mr-4">
              <Package size={24} className="text-orange-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Products Sold</p>
              <h3 className="text-2xl font-bold">{stats.productsSold}</h3>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <Users size={24} className="text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Customers</p>
              <h3 className="text-2xl font-bold">{stats.recentOrders.length}</h3>
            </div>
          </div>
        </div>
      </div>
      
      {/* Charts & Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
          <h2 className="text-lg font-medium mb-4">Weekly Sales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={salesData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-medium">Recent Orders</h2>
            <Link to="/admin/orders" className="text-sm text-blue-600 hover:underline">
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {stats.recentOrders.length > 0 ? (
              stats.recentOrders.map((order: any) => (
                <div key={order.id} className="flex justify-between pb-3 border-b">
                  <div>
                    <p className="font-medium">{order.profiles?.full_name || 'Unknown'}</p>
                    <p className="text-sm text-gray-500">Order #{order.id.slice(0, 8)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">${parseFloat(order.total_amount).toFixed(2)}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No recent orders</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
