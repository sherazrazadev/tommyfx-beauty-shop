import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { Separator } from '@/components/ui/separator';
import { formatCurrency } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';

const Cart = () => {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart(); // Fixed 'Cart' to 'cart'
  
  // Add these new states for shipping
  const [selectedShipping, setSelectedShipping] = useState<string>("free");
  const [shippingCost, setShippingCost] = useState<number>(0);
  
  // Define shipping options
  const shippingOptions = [
    { id: "free", name: "Free Shipping", description: "7-10 business days", price: 0 },
    { id: "standard", name: "Standard Shipping", description: "3-5 business days", price: 5.99 },
    { id: "express", name: "Express Shipping", description: "1-2 business days", price: 14.99 }
  ];
  
  // Update shipping cost when option changes
  useEffect(() => {
    const option = shippingOptions.find(option => option.id === selectedShipping);
    setShippingCost(option?.price || 0);
  }, [selectedShipping]);
  
  // Calculate order total (items + shipping)
  const calculateTotal = () => {
    return getCartTotal() + shippingCost;
  };
  
  // Check if free shipping applies (e.g., for orders over $50)
  const freeShippingThreshold = 50;
  const qualifiesForFreeShipping = getCartTotal() >= freeShippingThreshold;
  
  if (cart.length === 0) {
    return (
      <div className="container-custom py-16">
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-8">Looks like you haven't added any products to your cart yet.</p>
          <Link to="/categories">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container-custom">
        <h1 className="text-3xl font-bold mb-8">Your Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50 text-left">
                    <tr>
                      <th className="px-6 py-4 text-sm font-medium text-gray-600">Product</th>
                      <th className="px-6 py-4 text-sm font-medium text-gray-600">Price</th>
                      <th className="px-6 py-4 text-sm font-medium text-gray-600">Quantity</th>
                      <th className="px-6 py-4 text-sm font-medium text-gray-600">Total</th>
                      <th className="px-6 py-4 text-sm font-medium text-gray-600">Remove</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    {cart.map((item) => (
                      <tr key={item.id}>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-16 h-16 object-cover rounded mr-4"
                            />
                            <div>
                              <Link to={`/product/${item.id}`} className="font-medium hover:text-tommyfx-blue">
                                {item.name}
                              </Link>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">{formatCurrency(item.price)}</td>
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <Minus size={14} />
                            </button>
                            <span className="w-12 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 rounded hover:bg-gray-100"
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 font-medium">{formatCurrency(item.price * item.quantity)}</td>

                        <td className="px-6 py-4">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="p-2 text-gray-500 hover:text-red-500 rounded-full hover:bg-gray-100"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="mt-6 flex justify-between">
              <Link to="/categories">
                <Button variant="outline">Continue Shopping</Button>
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6 h-fit">
            <h2 className="text-xl font-bold mb-4">Order Summary</h2>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>{formatCurrency(getCartTotal())}</span>
              </div>
              
              {/* Shipping options */}
              <div className="mt-4 mb-2">
                <h3 className="font-medium mb-2">Shipping Method</h3>
                
                <RadioGroup value={selectedShipping} onValueChange={setSelectedShipping}>
                  {shippingOptions.map(option => (
                    <div key={option.id} className="flex items-center space-x-2 mb-2">
                      <RadioGroupItem 
                        value={option.id} 
                        id={`shipping-${option.id}`}
                        disabled={option.id !== "free" && qualifiesForFreeShipping}
                      />
                      <Label 
                        htmlFor={`shipping-${option.id}`} 
                        className="flex justify-between w-full cursor-pointer"
                      >
                        <div>
                          <span className="font-medium">{option.name}</span>
                          <p className="text-sm text-gray-500">{option.description}</p>
                        </div>
                        <span>
                          {option.price === 0 ? "Free" : formatCurrency(option.price)}
                        </span>
                      </Label>
                    </div>
                  ))}
                </RadioGroup>
                
                {getCartTotal() > 0 && getCartTotal() < freeShippingThreshold && (
                  <div className="text-sm text-gray-500 mt-2">
                    Add {formatCurrency(freeShippingThreshold - getCartTotal())} more to qualify for free shipping
                  </div>
                )}
                
                {qualifiesForFreeShipping && (
                  <div className="text-sm text-green-600 font-medium mt-2">
                    You qualify for free shipping!
                  </div>
                )}
              </div>
              
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? "Free" : formatCurrency(shippingCost)}</span>
              </div>
              
              <Separator />
              
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span>{formatCurrency(calculateTotal())}</span>
              </div>
            </div>
            
            <Link to="/checkout">
              <Button className="w-full">Proceed to Checkout</Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;