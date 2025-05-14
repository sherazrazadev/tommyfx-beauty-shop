
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  ChevronRight, 
  ChevronLeft,
  MoreVertical,
  Eye,
  FileDown,
  Printer,
  Search,
  Filter,
  RefreshCw
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import AdminLayout from '@/components/layout/AdminLayout';

type Order = {
  id: string;
  created_at: string;
  status: string;
  total_amount: number;
  shipping_address: string | null;
  shipping_city: string | null;
  shipping_state: string | null;
  shipping_zip: string | null;
  shipping_country?: string | null;
  payment_method: string | null;
  phone?: string | null; // Make phone optional
  user_id: string | null;
  user_name?: string | null;
  user_email?: string | null;
  items_count?: number;
  updated_at?: string | null;
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  shipped: 'bg-purple-100 text-purple-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const OrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;
  const { isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) return;
    
    // Redirect if not admin
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page",
        variant: "destructive"
      });
      navigate('/');
    } else if (user) {
      fetchOrders();
    }
  }, [isAdmin, authLoading, user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // First, get all orders
      let query = supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }
      
      const { data: ordersData, error: ordersError } = await query;
      
      if (ordersError) throw ordersError;
      
      // If we have orders, get user data for each order
      if (ordersData && ordersData.length > 0) {
        // Get unique user IDs
        const userIds = ordersData
          .map(order => order.user_id)
          .filter((id): id is string => id !== null);
          
        let userProfiles: Record<string, any> = {};
        
        if (userIds.length > 0) {
          // Fetch user profiles
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          } else if (profilesData) {
            // Create a lookup map for user data
            userProfiles = profilesData.reduce((acc, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {} as Record<string, any>);
          }
        }
        
        // Get item counts for each order
        const enrichedOrders = await Promise.all(
          ordersData.map(async (order) => {
            // Get order items count
            const { count, error: countError } = await supabase
              .from('order_items')
              .select('*', { count: 'exact', head: true })
              .eq('order_id', order.id);
              
            if (countError) {
              console.error(`Error counting items for order ${order.id}:`, countError);
            }
            
            // Get user data if available
            const userData = order.user_id ? userProfiles[order.user_id] : null;
            
            // Cast the order data to our Order type and add the additional properties
            const enrichedOrder: Order = {
              ...order as any, // Cast to any first to avoid TypeScript errors
              user_name: userData?.full_name || 'Guest',
              user_email: userData?.email || 'No email',
              items_count: count || 0,
            };
            
            return enrichedOrder;
          })
        );
        
        setOrders(enrichedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to load orders",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && isAdmin && !authLoading) {
      fetchOrders();
    }
  }, [statusFilter, user, isAdmin, authLoading]);

  // Fix: Properly update order status and ensure it persists
  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      console.log(`Updating order ${orderId} status to ${newStatus}`);
      
      const { data, error } = await supabase
        .from('orders')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString() 
        })
        .eq('id', orderId)
        .select();
        
      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
      
      console.log('Update response:', data);
      
      // Update local state after successful database update
      setOrders(prev => 
        prev.map(order => 
          order.id === orderId ? { ...order, status: newStatus } : order
        )
      );
      
      toast({
        title: "Order updated",
        description: `Order status changed to ${newStatus}`
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    }
  };

  // Filter and paginate orders
  const filteredOrders = searchQuery
    ? orders.filter(order => 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.user_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.shipping_city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : orders;
    
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  const currentOrders = filteredOrders.slice(
    (currentPage - 1) * ordersPerPage,
    currentPage * ordersPerPage
  );

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  // Format currency
  const formatCurrency = (amount: number) => {
    return '$' + amount.toFixed(2);
  };

  const handleViewOrder = (orderId: string) => {
    navigate(`/admin/orders/${orderId}`);
  };

  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 md:mb-0">Orders</h1>
          
          <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Filter status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Orders</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="processing">Processing</SelectItem>
                  <SelectItem value="shipped">Shipped</SelectItem>
                  <SelectItem value="delivered">Delivered</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button variant="outline" size="sm" onClick={fetchOrders} className="flex gap-1 items-center">
              <RefreshCw className="h-4 w-4" />
              Refresh
            </Button>
          </div>
        </div>
        
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Items</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="w-[40px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5).fill(0).map((_, i) => (
                    <TableRow key={i} className="animate-pulse">
                      <TableCell><div className="h-4 bg-gray-100 rounded w-16"></div></TableCell>
                      <TableCell><div className="h-4 bg-gray-100 rounded w-32"></div></TableCell>
                      <TableCell><div className="h-4 bg-gray-100 rounded w-32"></div></TableCell>
                      <TableCell><div className="h-4 bg-gray-100 rounded w-20"></div></TableCell>
                      <TableCell><div className="h-4 bg-gray-100 rounded w-8"></div></TableCell>
                      <TableCell className="text-right"><div className="h-4 bg-gray-100 rounded w-16 ml-auto"></div></TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  ))
                ) : currentOrders.length > 0 ? (
                  currentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs">
                        {order.id.substring(0, 8)}...
                      </TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{order.user_name}</div>
                          <div className="text-sm text-gray-500">{order.user_email}</div>
                          {order.phone && (
                            <div className="text-sm text-gray-500">{order.phone}</div>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(order.created_at)}</TableCell>
                      <TableCell>
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order.id, value)}
                        >
                          <SelectTrigger className="h-8 w-[120px]">
                            <SelectValue>
                              <Badge 
                                className={`${statusColors[order.status] || 'bg-gray-100 text-gray-800'}`}
                              >
                                {order.status || 'unknown'}
                              </Badge>
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      </TableCell>
                      <TableCell>{order.items_count}</TableCell>
                      <TableCell className="text-right font-medium">
                        {formatCurrency(order.total_amount)}
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => handleViewOrder(order.id)}>
                              <Eye className="mr-2 h-4 w-4" />
                              <span>View details</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Printer className="mr-2 h-4 w-4" />
                              <span>Print invoice</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <FileDown className="mr-2 h-4 w-4" />
                              <span>Export</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      No orders found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
        
        {filteredOrders.length > 0 && (
          <div className="flex justify-between items-center mt-4">
            <div className="text-sm text-gray-500">
              Showing {((currentPage - 1) * ordersPerPage) + 1} to {Math.min(currentPage * ordersPerPage, filteredOrders.length)} of {filteredOrders.length} orders
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrdersPage;
