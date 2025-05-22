import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

// TypeScript declaration for EmailJS
declare global {
  interface Window {
    emailjs?: {
      init: (publicKey: string) => void;
      send: (serviceId: string, templateId: string, params: any) => Promise<any>;
    };
  }
}

// EmailJS configuration - Your actual values
const EMAILJS_CONFIG = {
  SERVICE_ID: 'service_k4fbtcp',
  TEMPLATE_ID: 'template_kxa0b6r',
  PUBLIC_KEY: '-EsbRIt0G73FvbsW2'
};

const Checkout = () => {
  const { cart, getCartTotal, clearCart, shipping } = useCart();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'Pakistan',
  });
  const [processing, setProcessing] = useState(false);

  const total = getCartTotal() + (shipping?.cost || 0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const required = ['name', 'email', 'phone', 'address', 'city'];
    const missing = required.filter(field => !formData[field as keyof typeof formData]);
    
    if (missing.length > 0) {
      toast({
        title: "Missing Information",
        description: `Please fill in: ${missing.join(', ')}`,
        variant: "destructive"
      });
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return false;
    }

    return true;
  };

  // Fixed EmailJS implementation
  const sendOrderEmailDirect = async (orderData: any) => {

    // DEVELOPMENT: Email disabled - uncomment below to enable
    console.log('📧 Email disabled for development');
    return false;
    // try {
    //   // Load EmailJS script if not loaded
    //   if (!window.emailjs) {
    //     const script = document.createElement('script');
    //     script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
    //     script.async = true;
    //     document.head.appendChild(script);
        
    //     await new Promise<void>((resolve, reject) => {
    //       script.onload = () => resolve();
    //       script.onerror = () => reject(new Error('Failed to load EmailJS'));
    //     });
        
    //     // Initialize EmailJS
    //     window.emailjs?.init(EMAILJS_CONFIG.PUBLIC_KEY);
    //   }

    //   // Prepare email data - Match your template exactly
    //   const emailParams = {
    //     // IMPORTANT: Your template uses {{email}} in "To email" field
    //     email: formData.email,           // This matches {{email}} in your template
    //     to_name: formData.name,          // This matches {{to_name}} in your template
        
    //     // Order details for your template
    //     order_id: orderData.id.substring(0, 8),
    //     order_items: cart.map(item => 
    //       `${item.name} (Qty: ${item.quantity}) - Rs. ${(item.price * item.quantity).toFixed(2)}`
    //     ).join('\n'),
    //     order_total: `Rs. ${total.toFixed(2)}`,
        
    //     // Additional useful fields (optional)
    //     customer_name: formData.name,
    //     customer_phone: formData.phone,
    //     customer_address: `${formData.address}, ${formData.city}${formData.state ? `, ${formData.state}` : ''}${formData.zip ? ` ${formData.zip}` : ''}, ${formData.country}`,
    //     order_date: new Date().toLocaleDateString('en-US', {
    //       year: 'numeric',
    //       month: 'long',
    //       day: 'numeric'
    //     })
    //   };

    //   console.log('📧 Sending email with params:', emailParams);

    //   // Send email via EmailJS
    //   const result = await window.emailjs?.send(
    //     EMAILJS_CONFIG.SERVICE_ID,
    //     EMAILJS_CONFIG.TEMPLATE_ID,
    //     emailParams
    //   );

    //   console.log('✅ Email sent successfully:', result);
    //   return true;
      
    // } catch (error: any) {
    //   console.error('❌ Email failed:', error);
      
    //   // Log specific error details
    //   if (error.text) {
    //     console.error('Error details:', error.text);
    //   }
      
    //   return false;
    // }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      toast({
        title: "Empty Cart",
        description: "Please add items to your cart before checkout.",
        variant: "destructive"
      });
      return;
    }

    if (!validateForm()) return;

    setProcessing(true);

    try {
      // 1. Create order in database
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: null,
          total_amount: total,
          status: 'pending',
          payment_method: 'COD',
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_state: formData.state || null,
          shipping_zip: formData.zip || null,
          shipping_country: formData.country,
          phone: formData.phone,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Create order items
      const orderItems = cart.map(item => ({
        order_id: orderData.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.price,
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // 3. Send confirmation email (non-blocking)
      const emailSent = await sendOrderEmailDirect(orderData);

      // 4. Clear cart and show success
      clearCart();
      
      toast({
        title: "Order Placed Successfully! 🎉",
        description: `Order #${orderData.id.substring(0, 8)} confirmed.${emailSent ? ' Check your email for details.' : ' We\'ll contact you at ' + formData.phone + ' soon.'}`,
        duration: 2000
      });

      // 5. Redirect after toast
      setTimeout(() => navigate('/'), 2100);
      
    } catch (error: any) {
      console.error("Checkout failed:", error);
      toast({
        title: "Checkout Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
        duration: 2000
      });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container-custom py-12">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Order Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
          </CardHeader>
          <CardContent>
            {cart.length === 0 ? (
              <p className="text-gray-500">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} ({item.quantity})</span>
                    <span>{formatCurrency(item.price * item.quantity)}</span>
                  </div>
                ))}
                
                <div className="flex justify-between text-gray-600 pt-2 border-t">
                  <span>Subtotal</span>
                  <span>{formatCurrency(getCartTotal())}</span>
                </div>
                
                {shipping && (
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping ({shipping.name})</span>
                    <span>{shipping.cost === 0 ? "Free" : formatCurrency(shipping.cost)}</span>
                  </div>
                )}
                
                <div className="flex justify-between font-bold pt-2 border-t">
                  <span>Total:</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Customer Form */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
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
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="state">State (Optional)</Label>
                  <Input
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label htmlFor="zip">ZIP Code (Optional)</Label>
                  <Input
                    id="zip"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="country">Country *</Label>
                <Input
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
                {processing ? "Processing..." : `Place Order - ${formatCurrency(total)}`}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Checkout;