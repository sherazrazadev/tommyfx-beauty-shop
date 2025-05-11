
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Clock, CheckCircle2, XCircle, Truck, BoxIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';

type OrderItemType = {
  id: string;
  product_id: string;
  product_name: string;
  price: number;
  quantity: number;
  order_id: string;
};

// Extended type for order with customer information
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
  customer_email?: string; // Optional field added during data processing
  customer_name?: string; // Optional field added during data processing
};

const OrderDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderType | null>(null);
  const [orderItems, setOrderItems] = useState<OrderItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      setLoading(true);
      try {
        console.log("Fetching order details for ID:", id);
        
        // Fetch the order
        const { data: orderData, error: orderError } = await supabase
          .from('orders')
          .select('*')
          .eq('id', id)
          .single();
        
        if (orderError) {
          console.error("Error fetching order:", orderError);
          throw orderError;
        }
        
        console.log("Order fetched:", orderData);
        
        // Create a mutable copy of the order to add customer information
        const orderWithCustomer: OrderType = {
          ...orderData,
          customer_email: undefined,
          customer_name: undefined
        };
        
        // Fetch user profile
        if (orderWithCustomer.user_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('email, full_name')
            .eq('id', orderWithCustomer.user_id)
            .single();
            
          if (profileError && profileError.code !== 'PGRST116') {
            console.error("Error fetching profile:", profileError);
          }
          
          if (profileData) {
            orderWithCustomer.customer_email = profileData.email;
            orderWithCustomer.customer_name = profileData.full_name || 'Unknown';
          }
        }
        
        setOrder(orderWithCustomer);
        
        // Fetch order items
        const { data: itemsData, error: itemsError } = await supabase
          .from('order_items')
          .select('*')
          .eq('order_id', id);
          
        if (itemsError) {
          console.error("Error fetching order items:", itemsError);
          throw itemsError;
        }
        
        console.log("Order items fetched:", itemsData?.length || 0);
        setOrderItems(itemsData || []);
        
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          title: "Error",
          description: "Failed to load order details",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchOrderDetails();
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus: string) => {
    if (!order) return;
    
    setUpdatingStatus(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', order.id);
        
      if (error) throw error;
      
      setOrder({ ...order, status: newStatus });
      
      toast({
        title: "Status Updated",
        description: `Order status changed to ${newStatus}`,
      });
    } catch (error) {
      console.error('Error updating status:', error);
      toast({
        title: "Error",
        description: "Failed to update order status",
        variant: "destructive"
      });
    } finally {
      setUpdatingStatus(false);
    }
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
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-5 w-5 text-amber-500" />;
      case 'processing':
        return <BoxIcon className="h-5 w-5 text-blue-500" />;
      case 'delivered':
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Truck className="h-5 w-5 text-gray-500" />;
    }
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Order Details</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/admin/orders" className="hover:text-tommyfx-blue">Orders</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Details</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/orders')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Orders
        </Button>
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-64 w-full rounded-lg" />
          </div>
        ) : order ? (
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h2 className="text-lg font-medium mb-1">Order #{order.id.slice(0, 8)}</h2>
                  <p className="text-sm text-gray-500">
                    Placed on {new Date(order.created_at).toLocaleDateString()}
                  </p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1 capitalize">{order.status}</span>
                  </span>
                  
                  <div className="flex gap-2">
                    {order.status === 'pending' && (
                      <>
                        <Button 
                          size="sm" 
                          onClick={() => handleStatusUpdate('processing')}
                          disabled={updatingStatus}
                        >
                          Process
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-red-500"
                          onClick={() => handleStatusUpdate('cancelled')}
                          disabled={updatingStatus}
                        >
                          Cancel
                        </Button>
                      </>
                    )}
                    {order.status === 'processing' && (
                      <Button 
                        size="sm" 
                        onClick={() => handleStatusUpdate('delivered')}
                        disabled={updatingStatus}
                      >
                        Mark Delivered
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-6">
                {/* Customer Info */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer</h3>
                  <p className="font-medium">{order.customer_name || 'Unknown'}</p>
                  <p className="text-sm">{order.customer_email || 'No email'}</p>
                </div>
                
                {/* Shipping Address */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Ship To</h3>
                  <p>{order.shipping_address}</p>
                  <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
                  <p>{order.shipping_country}</p>
                </div>
                
                {/* Payment Method */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Method</h3>
                  <p className="capitalize">{order.payment_method?.replace(/_/g, ' ')}</p>
                </div>
                
                {/* Order Total */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Total</h3>
                  <p className="text-lg font-bold">${order.total_amount.toFixed(2)}</p>
                </div>
              </div>
            </div>
            
            {/* Order Items */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-medium mb-4">Order Items</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Price
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Quantity
                      </th>
                      <th className="px-6 py-3 text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {orderItems.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="font-medium">{item.product_name}</div>
                          <div className="text-xs text-gray-500">ID: {item.product_id}</div>
                        </td>
                        <td className="px-6 py-4">
                          ${item.price.toFixed(2)}
                        </td>
                        <td className="px-6 py-4">
                          {item.quantity}
                        </td>
                        <td className="px-6 py-4 font-medium">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        Total:
                      </td>
                      <td className="px-6 py-4 font-bold">
                        ${order.total_amount.toFixed(2)}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              {orderItems.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No items found for this order.
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <p className="text-gray-500">Order not found</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default OrderDetail;
