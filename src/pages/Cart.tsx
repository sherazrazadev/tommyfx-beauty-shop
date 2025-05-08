
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Minus, Plus, X, ShoppingBag, ArrowRight } from 'lucide-react';
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

const Cart = () => {
  const [items, setItems] = useState(cartItems);
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    setItems(items.map(item => (item.id === id ? { ...item, quantity } : item)));
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  // Calculate totals
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal > 50 ? 0 : 5.99;
  const total = subtotal + shipping;

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gray-100 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Your Shopping Cart</h1>
            <div className="flex items-center justify-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-800">Cart</span>
            </div>
          </div>
        </div>
      </section>

      {/* Cart Content */}
      <section className="py-12">
        <div className="container-custom">
          {items.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="text-left p-4 font-medium">Product</th>
                        <th className="text-center p-4 font-medium hidden sm:table-cell">Price</th>
                        <th className="text-center p-4 font-medium">Quantity</th>
                        <th className="text-right p-4 font-medium hidden sm:table-cell">Subtotal</th>
                        <th className="p-4"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map(item => (
                        <tr key={item.id} className="border-t">
                          <td className="p-4">
                            <div className="flex items-center">
                              <Link to={`/product/${item.id}`} className="w-16 h-16 rounded overflow-hidden hidden sm:block">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </Link>
                              <div className="sm:ml-4 flex-1">
                                <Link 
                                  to={`/product/${item.id}`} 
                                  className="font-medium hover:text-tommyfx-blue transition-colors"
                                >
                                  {item.name}
                                </Link>
                                <p className="text-gray-500 mt-1 sm:hidden">
                                  ${item.price.toFixed(2)}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4 text-center hidden sm:table-cell">
                            ${item.price.toFixed(2)}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-center">
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                                aria-label="Decrease quantity"
                              >
                                <Minus size={16} />
                              </button>
                              <span className="mx-2 w-8 text-center">{item.quantity}</span>
                              <button 
                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                className="p-1 hover:bg-gray-100 rounded"
                                aria-label="Increase quantity"
                              >
                                <Plus size={16} />
                              </button>
                            </div>
                          </td>
                          <td className="p-4 text-right font-medium hidden sm:table-cell">
                            ${(item.price * item.quantity).toFixed(2)}
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-gray-400 hover:text-red-500"
                              aria-label="Remove item"
                            >
                              <X size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <Link to="/categories" className="flex items-center text-tommyfx-blue">
                    <ArrowRight size={16} className="mr-2 rotate-180" />
                    Continue Shopping
                  </Link>
                  <Button onClick={() => setItems([])}>Clear Cart</Button>
                </div>
              </div>

              {/* Order Summary */}
              <div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h2 className="text-xl font-bold mb-6">Order Summary</h2>
                  
                  <div className="space-y-3 mb-6">
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
                    {shipping > 0 && (
                      <div className="text-sm text-gray-500">
                        Free shipping on orders over $50
                      </div>
                    )}
                    <div className="border-t pt-3 mt-3 flex justify-between font-bold">
                      <span>Total</span>
                      <span>${total.toFixed(2)}</span>
                    </div>
                  </div>
                  
                  <Button asChild className="btn-primary w-full">
                    <Link to="/checkout">
                      Proceed to Checkout
                    </Link>
                  </Button>
                  
                  <div className="mt-6">
                    <h3 className="font-medium mb-2">We Accept:</h3>
                    <div className="flex items-center space-x-2">
                      <div className="bg-white p-1 rounded border">Visa</div>
                      <div className="bg-white p-1 rounded border">Mastercard</div>
                      <div className="bg-white p-1 rounded border">Amex</div>
                      <div className="bg-white p-1 rounded border">PayPal</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <ShoppingBag size={64} className="mx-auto text-gray-300 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
              <p className="text-gray-600 mb-6">Looks like you haven't added any products yet.</p>
              <Button asChild className="btn-primary">
                <Link to="/categories">Start Shopping</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Cart;
