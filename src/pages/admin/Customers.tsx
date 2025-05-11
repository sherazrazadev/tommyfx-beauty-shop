
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Calendar, UserCircle, MoreVertical, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/hooks/useAuth';

type Customer = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  zip: string | null;
  created_at: string | null;
  role: string;
  orders_count: number;
  total_spent: number;
};

const CustomersPage = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { isAdmin, loading: authLoading } = useAuth();
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
    } else {
      fetchCustomers();
    }
  }, [isAdmin, authLoading, navigate]);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      
      // Fetch all profiles with role 'user'
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'user')
        .order('created_at', { ascending: false });
      
      if (profilesError) throw profilesError;
      
      // Get order counts and totals for each user
      if (profilesData && profilesData.length > 0) {
        const customersWithOrderData = await Promise.all(
          profilesData.map(async (profile) => {
            try {
              // Get orders for this user
              const { data: ordersData, error: ordersError } = await supabase
                .from('orders')
                .select('id, total_amount')
                .eq('user_id', profile.id);
                
              if (ordersError) throw ordersError;
              
              const ordersCount = ordersData?.length || 0;
              const totalSpent = ordersData?.reduce((sum, order) => sum + (order.total_amount || 0), 0) || 0;
              
              return {
                ...profile,
                orders_count: ordersCount,
                total_spent: totalSpent
              };
            } catch (error) {
              console.error(`Error fetching orders for user ${profile.id}:`, error);
              return {
                ...profile,
                orders_count: 0,
                total_spent: 0
              };
            }
          })
        );
        
        setCustomers(customersWithOrderData);
      } else {
        setCustomers([]);
      }
    } catch (error) {
      console.error('Error fetching customers:', error);
      toast({
        title: "Error",
        description: "Failed to load customers",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const filteredCustomers = searchQuery
    ? customers.filter(
        customer =>
          customer.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          customer.phone?.includes(searchQuery)
      )
    : customers;

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString();
  };

  const getFullAddress = (customer: Customer) => {
    const parts = [
      customer.address,
      customer.city,
      customer.state,
      customer.zip,
      customer.country
    ].filter(Boolean);
    
    return parts.length > 0 ? parts.join(', ') : 'No address provided';
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
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <h1 className="text-2xl font-bold mb-4 sm:mb-0">Customers</h1>
          
          <div className="w-full sm:w-auto flex gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Search customers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8"
              />
            </div>
            <Button variant="outline" onClick={fetchCustomers}>
              Refresh
            </Button>
          </div>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Card key={i} className="h-[200px] animate-pulse bg-gray-100">
                <CardContent className="p-6">
                  <div className="h-full flex flex-col justify-center items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-4 w-2/3 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 w-1/2 bg-gray-200 rounded"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredCustomers.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {filteredCustomers.map((customer) => (
              <Card key={customer.id} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 rounded-full w-12 h-12 flex items-center justify-center">
                        <UserCircle className="h-8 w-8 text-gray-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-lg">{customer.full_name || 'No Name'}</h3>
                        <p className="text-sm text-gray-500">{customer.email || 'No Email'}</p>
                      </div>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Send Email</DropdownMenuItem>
                        <DropdownMenuItem>View Orders</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    {customer.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-gray-500" />
                        <span>{customer.phone}</span>
                      </div>
                    )}
                    
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                      <span className="flex-1">{getFullAddress(customer)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>Joined: {formatDate(customer.created_at)}</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <div>
                      <Badge variant="outline" className="mr-2">
                        {customer.orders_count} Orders
                      </Badge>
                      {customer.orders_count > 0 && (
                        <Badge variant="secondary">
                          ${customer.total_spent.toFixed(2)}
                        </Badge>
                      )}
                    </div>
                    <Button size="sm" variant="ghost">View</Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center p-12 bg-gray-50 rounded-lg">
            <UserCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-lg font-medium">No customers found</h3>
            <p className="text-gray-500">
              {searchQuery
                ? "No customers match your search criteria"
                : "Your customer list will appear here when you have customers"}
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default CustomersPage;
