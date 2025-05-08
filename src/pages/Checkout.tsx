
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, CreditCard, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

// Mock data
const cartItems = [
  {
    id: '1',
    name: 'Hydrating Facial Serum',
    price: 34.99,
    image: 'https://source.unsplash.com/oG8PIWBc3nE',
    quantity: 1
  },
  {
    id: '2',
    name: 'Matte Finish Foundation',
    price: 29.99,
    image: 'https://source.unsplash.com/UKWFNya-YHk',
    quantity: 2
  }
];

interface Address {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

const Checkout = () => {
  const [items] = useState(cartItems);
  const [step, setStep] = useState(1);
  const [isLoggedIn] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [formValues, setFormValues] = useState<Address>({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const placeOrder = () => {
    setStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gray-100 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Checkout</h1>
            <div className="flex items-center justify-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <Link to="/cart" className="text-gray-500 hover:text-tommyfx-blue">
                Cart
              </Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-800">Checkout</span>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Steps */}
      <section className="py-10 mb-4">
        <div className="container-custom">
          <div className="flex justify-between max-w-xl mx-auto">
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mb-2 
                ${step >= 1 ? 'bg-tommyfx-blue' : 'bg-gray-300'}`}>
                1
              </div>
              <span className={step >= 1 ? 'font-medium' : 'text-gray-500'}>
                Shipping
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mb-2 
                ${step >= 2 ? 'bg-tommyfx-blue' : 'bg-gray-300'}`}>
                2
              </div>
              <span className={step >= 2 ? 'font-medium' : 'text-gray-500'}>
                Payment
              </span>
            </div>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm mb-2 
                ${step >= 3 ? 'bg-tommyfx-blue' : 'bg-gray-300'}`}>
                3
              </div>
              <span className={step >= 3 ? 'font-medium' : 'text-gray-500'}>
                Confirmation
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Checkout Content */}
      <section className="pb-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              {step === 1 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-6">Shipping Information</h2>
                  
                  {!isLoggedIn && (
                    <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                      <p>Already have an account? <Link to="/login" className="text-tommyfx-blue">Login</Link></p>
                    </div>
                  )}
                  
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div>
                        <label htmlFor="name" className="block mb-2 font-medium">
                          Full Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formValues.name}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block mb-2 font-medium">
                          Email Address*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formValues.email}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="phone" className="block mb-2 font-medium">
                        Phone Number*
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formValues.phone}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                        required
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="address" className="block mb-2 font-medium">
                        Address*
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formValues.address}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div>
                        <label htmlFor="city" className="block mb-2 font-medium">
                          City*
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formValues.city}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="state" className="block mb-2 font-medium">
                          State/Province*
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formValues.state}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="zip" className="block mb-2 font-medium">
                          ZIP/Postal Code*
                        </label>
                        <input
                          type="text"
                          id="zip"
                          name="zip"
                          value={formValues.zip}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="country" className="block mb-2 font-medium">
                        Country*
                      </label>
                      <select
                        id="country"
                        name="country"
                        value={formValues.country}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                        required
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="Australia">Australia</option>
                        <option value="France">France</option>
                        <option value="Germany">Germany</option>
                      </select>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit" className="btn-primary">
                        Continue to Payment
                      </Button>
                    </div>
                  </form>
                </div>
              )}
              
              {step === 2 && (
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <h2 className="text-xl font-bold mb-6">Payment Method</h2>
                  
                  <div className="space-y-4 mb-8">
                    <div className="border rounded-md p-4 flex items-center">
                      <input
                        type="radio"
                        id="cash"
                        name="payment"
                        value="cash"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="mr-3"
                      />
                      <label htmlFor="cash" className="flex-1">
                        <span className="font-medium">Cash on Delivery</span>
                        <p className="text-sm text-gray-500 mt-1">
                          Pay when your order is delivered
                        </p>
                      </label>
                    </div>
                    
                    <div className="border rounded-md p-4 flex items-center opacity-50">
                      <input
                        type="radio"
                        id="card"
                        name="payment"
                        value="card"
                        disabled
                        className="mr-3"
                      />
                      <label htmlFor="card" className="flex-1">
                        <span className="font-medium flex items-center">
                          Credit / Debit Card
                          <CreditCard size={18} className="ml-2" />
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                          Coming soon
                        </p>
                      </label>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button 
                      variant="outline" 
                      onClick={() => setStep(1)}
                      className="btn-outline"
                    >
                      Back to Shipping
                    </Button>
                    <Button onClick={placeOrder} className="btn-primary">
                      Place Order
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                  <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold mb-4">Order Successfully Placed!</h2>
                  <p className="mb-6 text-gray-600">
                    Your order has been placed and will be delivered soon. We've sent a confirmation email to {formValues.email}.
                  </p>
                  <p className="font-medium mb-8">Order ID: #TFX23789456</p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button asChild className="btn-primary">
                      <Link to="/profile">View Order</Link>
                    </Button>
                    <Button asChild variant="outline" className="btn-outline">
                      <Link to="/">Continue Shopping</Link>
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Order Summary */}
            {step < 3 && (
              <div>
                <div className="bg-gray-50 p-6 rounded-lg sticky top-24">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="mb-6">
                    {items.map(item => (
                      <div key={item.id} className="flex mb-4">
                        <div className="w-16 h-16 rounded overflow-hidden">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                        <div className="ml-4 flex-1">
                          <h4 className="font-medium">{item.name}</h4>
                          <div className="flex justify-between mt-1 text-gray-600">
                            <span>Qty: {item.quantity}</span>
                            <span>${(item.price * item.quantity).toFixed(2)}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="space-y-3 mb-6 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span className="font-medium">
                        {shipping > 0 ? `$${shipping.toFixed(2)}` : 'Free'}
                      </span>
                    </div>
                    <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Checkout;
