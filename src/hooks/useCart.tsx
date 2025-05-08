
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
};

type CartContextType = {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getItemsCount: () => number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // Load cart from localStorage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage', error);
        localStorage.removeItem('cart');
      }
    }
  }, []);
  
  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);
  
  const addToCart = (item: CartItem) => {
    setCart(currentCart => {
      // Check if item already exists in cart
      const existingItemIndex = currentCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex > -1) {
        // Update quantity of existing item
        const updatedCart = [...currentCart];
        updatedCart[existingItemIndex].quantity += item.quantity;
        return updatedCart;
      } else {
        // Add new item to cart
        return [...currentCart, item];
      }
    });
  };
  
  const removeFromCart = (id: string) => {
    setCart(currentCart => currentCart.filter(item => item.id !== id));
    toast({
      title: "Item removed",
      description: "Item has been removed from your cart",
    });
  };
  
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) return;
    
    setCart(currentCart => 
      currentCart.map(item => 
        item.id === id ? { ...item, quantity } : item
      )
    );
  };
  
  const clearCart = () => {
    setCart([]);
  };
  
  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  const getItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };
  
  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      getCartTotal,
      getItemsCount
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
