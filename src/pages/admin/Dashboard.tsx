
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, ShoppingBag, DollarSign, Package, MessageSquare } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import AdminLayout from '@/components/layout/AdminLayout';
import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';

// Types
interface StatsType {
  totalOrders: number;
  totalRevenue: number;
  productsSold: number;
  feedbackCount: number;
  recentOrders: any[];
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<StatsType>({
    totalOrders: 0,
    totalRevenue: 0,
    productsSold: 0,
    feedbackCount: 0,
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
        console.log("Fetching dashboard data...");
        
        // Get total orders
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('id, total_amount, created_at, user_id');
        
        if (ordersError) {
          console.error("Error fetching orders:", ordersError);
          throw ordersError;
        }
        
        console.log("Orders fetched:", orders?.length || 0);
        
        // Fetch user profiles in a separate query
        const userIds = orders?.map(order => order.user_id).filter(Boolean) || [];
        let userProfiles: Record<string, { full_name?: string; email?: string }> = {};
        
        if (userIds.length > 0) {
          const { data: profiles, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);
          
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          } else if (profiles) {
            console.log("Profiles fetched:", profiles.length);
            // Create a lookup object
            userProfiles = profiles.reduce((acc: Record<string, any>, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
          }
        }

        // Get total products sold (sum of quantities from order_items)
        const { data: orderItems, error: itemsError } = await supabase
          .from('order_items')
          .select('quantity');
        
        if (itemsError) {
          console.error("Error fetching order items:", itemsError);
          throw itemsError;
        }
        
        console.log("Order items fetched:", orderItems?.length || 0);
        
        // Get feedback count
        const { count: feedbackCount, error: feedbackError } = await supabase
          .from('feedback')
          .select('*', { count: 'exact', head: true });
          
        if (feedbackError) {
          console.error("Error fetching feedback count:", feedbackError);
          throw feedbackError;
        }
        
        console.log("Feedback count:", feedbackCount);

        // Calculate stats
        const totalOrders = orders?.length || 0;
        const totalRevenue = orders?.reduce((sum: number, order: any) => sum + parseFloat(order.total_amount), 0) || 0;
        const productsSold = orderItems?.reduce((sum: number, item: any) => sum + item.quantity, 0) || 0;
        
        // Get latest 5 orders and attach user info
        const recentOrders = (orders || [])
          .sort((a: any, b: any) => {
            return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
          })
          .slice(0, 5)
          .map((order: any) => {
            const userProfile = userProfiles[order.user_id] || {};
            return {
              ...order,
              user_full_name: userProfile.full_name || 'Unknown',
              user_email: userProfile.email || 'No email'
            };
          });
          
        console.log("Recent orders processed:", recentOrders.length);

        setStats({
          totalOrders,
          totalRevenue,
          productsSold,
          feedbackCount: feedbackCount || 0,
          recentOrders
        });

      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        toast({
          title: "Error",
          description: "Failed to load dashboard data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  // Render dashboard with loadable sections
  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <span className="text-sm text-gray-500">Welcome, Admin</span>
        </div>
        
        {/* Stats Cards with loading states */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
          {loading ? (
            <>
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <Skeleton className="h-12 w-full mb-2" />
                  <Skeleton className="h-6 w-1/2" />
                </div>
              ))}
            </>
          ) : (
            <>
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
                    <MessageSquare size={24} className="text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Feedback</p>
                    <h3 className="text-2xl font-bold">{stats.feedbackCount}</h3>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
        
        {/* Charts & Tables with loading states */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {loading ? (
            <>
              <div className="bg-white p-6 rounded-lg shadow-sm lg:col-span-2">
                <Skeleton className="h-8 w-40 mb-4" />
                <Skeleton className="h-80 w-full" />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <Skeleton className="h-8 w-40 mb-4" />
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              </div>
            </>
          ) : (
            <>
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
                          <p className="font-medium">{order.user_full_name || 'Unknown'}</p>
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
            </>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
