
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Checkout = () => {
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  
  const [loading, setLoading] = useState(false);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Please add some products to your cart before checking out",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Only logged in users can checkout
      if (!user) {
        toast({
          title: "Please log in",
          description: "You need to be logged in to complete your order",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      // Create new order
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total_amount: getCartTotal(),
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state,
          shipping_zip: formData.zipCode,
          shipping_country: formData.country
        })
        .select('id')
        .single();
      
      if (orderError) throw orderError;
      
      // Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_id: item.id,
        product_name: item.name,
        price: item.price,
        quantity: item.quantity
      }));
      
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);
      
      if (itemsError) throw itemsError;
      
      // Update user profile if needed
      if (formData.fullName || formData.phone || formData.address) {
        await supabase
          .from('profiles')
          .update({
            full_name: formData.fullName || null,
            phone: formData.phone || null,
            address: formData.address || null,
            city: formData.city || null,
            state: formData.state || null,
            zip: formData.zipCode || null,
            country: formData.country || 'United States'
          })
          .eq('id', user.id);
      }
      
      // Clear cart and show success message
      clearCart();
      
      toast({
        title: "Order placed successfully!",
        description: "Thank you for your purchase",
      });
      
      navigate('/');
      
    } catch (error: any) {
      console.error('Checkout error:', error);
      toast({
        title: "Checkout failed",
        description: error.message || "An error occurred while processing your order",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Load user profile data when component mounts
  useState(() => {
    const fetchUserProfile = async () => {
      if (user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
          
        if (data) {
          setFormData({
            fullName: data.full_name || '',
            email: user.email || '',
            phone: data.phone || '',
            address: data.address || '',
            city: data.city || '',
            state: data.state || '',
            zipCode: data.zip || '',
            country: data.country || 'United States'
          });
        }
      }
    };
    
    fetchUserProfile();
  });
  
  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium mb-1">
                    Address
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium mb-1">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium mb-1">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium mb-1">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zipCode"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleInputChange}
                      className="w-full p-2 border rounded"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="country" className="block text-sm font-medium mb-1">
                    Country
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    className="w-full p-2 border rounded"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    {/* Add more countries as needed */}
                  </select>
                </div>
                
                <div className="mb-6">
                  <h3 className="font-medium mb-2">Payment Method</h3>
                  <div className="border rounded p-4 flex items-center">
                    <input
                      type="radio"
                      id="cashOnDelivery"
                      name="paymentMethod"
                      checked
                      readOnly
                      className="mr-2"
                    />
                    <label htmlFor="cashOnDelivery">Cash on Delivery</label>
                  </div>
                </div>
                
                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? 'Processing...' : 'Place Order'}
                </Button>
              </form>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            
            <div className="mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between py-2">
                  <div>
                    <span className="font-medium">{item.name}</span>
                    <div className="text-sm text-gray-500">Qty: {item.quantity}</div>
                  </div>
                  <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                </div>
              ))}
            </div>
            
            <Separator className="my-4" />
            
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>Free</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
