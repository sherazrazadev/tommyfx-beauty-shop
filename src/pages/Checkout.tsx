import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Info } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
// import { sendOrderConfirmationEmail } from '@/integrations/sendgrid/emailUtils';
import { sendOrderConfirmationEmail } from '@/integrations/sendgrid/emailClient';

const Checkout = () => {
  const { cart, getCartTotal, clearCart, shipping } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.user_metadata?.full_name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Pakistan',  // Add this line with a default value

  });
  const [processing, setProcessing] = useState(false);
  const [checkoutAsGuest, setCheckoutAsGuest] = useState(!user);

  const total = getCartTotal() + (shipping?.cost || 0);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.user_metadata?.full_name || '',
        email: user.email || '',
        phone: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country:'',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "Your cart is empty",
        description: "Add some items to your cart before checking out.",
      });
      return;
    }

    if (!formData.phone) {
      toast({
        title: "Phone number required",
        description: "Please provide your phone number for delivery coordination.",
        variant: "destructive"
      });
      return;
    }

    setProcessing(true);
    try {
      // Create a new order in the database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert([
          {
            user_id: user?.id || null,
            total_amount: total,
            status: 'pending',
            payment_method: 'COD', // Default payment method
            shipping_address: formData.address,
            shipping_city: formData.city,
            shipping_state: formData.state,
            shipping_zip: formData.zip,
            phone: formData.phone, // Add phone to order
          }
        ])
        .select()

      if (orderError) {
        throw orderError;
      }

      const newOrder = orderData ? orderData[0] : null;

      if (!newOrder) {
        throw new Error('Failed to create order');
      }

      // Create order items for each item in the cart
      const orderItems = cart.map(item => ({
        order_id: newOrder.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: orderItemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (orderItemsError) {
        throw orderItemsError;
      }

      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail(
          newOrder,
          {
            name: formData.name,
            email: formData.email,
            address: formData.address,
            city: formData.city,
            state: formData.state,
            zip: formData.zip,
            country: formData.country
          },
          cart
        );
      } catch (emailError) {
        console.error("Failed to send order confirmation email:", emailError);
        // Don't stop the checkout process if email fails
      }

      // Clear the cart
      clearCart();

      // Show success message
      toast({
        title: "Order placed",
        description: "Your order has been successfully placed! You'll receive a confirmation email shortly.",
      });

      // Redirect to order confirmation page or home page
      navigate('/');
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast({
        title: "Checkout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {!user && (
        <div className="bg-blue-50 p-4 rounded-md mb-6">
          <div className="flex items-center mb-2">
            <Info size={20} className="text-blue-500 mr-2" />
            <h3 className="font-medium">Complete checkout as a guest or sign in</h3>
          </div>
          <p className="text-sm mb-3">
            You're checking out as a guest. You can create an account or sign in to save your details for future orders.
          </p>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={() => navigate('/login')}>
              Sign in
            </Button>
            <Button variant="outline" onClick={() => navigate('/signup')}>
              Create account
            </Button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} ({item.quantity})</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                
                {shipping && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping {shipping.name ? `(${shipping.name})` : ''}</span>
                    <span>{shipping.cost === 0 ? "Free" : formatCurrency(shipping.cost)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Checkout Form */}
        <Card>
          <CardHeader>
            <CardTitle>Shipping Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number *</Label>
                <Input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="923074567890"
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Address *</Label>
                <Input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State *</Label>
                  <Input
                    type="text"
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="zip">ZIP Code *</Label>
                <Input
                  type="text"
                  id="zip"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Add this to your form */}
              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
                  type="text"
                  id="country"
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                  required
                />
              </div>
              <Button 
                type="submit" 
                disabled={processing || cart.length === 0}
                className="w-full"
              >
                {processing ? "Processing..." : `Place Order (${formatCurrency(total)})`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;