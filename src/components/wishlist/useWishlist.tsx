
import { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export type WishlistItem = {
  id: string;
  name: string;
  price: number;
  image: string;
};

type WishlistContextType = {
  wishlist: WishlistItem[];
  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string) => void;
  isInWishlist: (id: string) => boolean;
  clearWishlist: () => void;
};

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};

export const WishlistProvider = ({ children }: { children: ReactNode }) => {
  const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
  const { user } = useAuth();
  
  // Load wishlist from localStorage on initial load
  useEffect(() => {
    const loadWishlist = () => {
      try {
        const savedWishlist = localStorage.getItem('wishlist');
        if (savedWishlist) {
          setWishlist(JSON.parse(savedWishlist));
        }
      } catch (error) {
        console.error('Error loading wishlist from localStorage:', error);
        // If there's an error, reset the wishlist
        setWishlist([]);
      }
    };
    
    loadWishlist();
  }, []);
  
  // Save wishlist to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem('wishlist', JSON.stringify(wishlist));
    } catch (error) {
      console.error('Error saving wishlist to localStorage:', error);
    }
  }, [wishlist]);
  
  // Function to add an item to wishlist
  const addToWishlist = (item: WishlistItem) => {
    if (!isInWishlist(item.id)) {
      setWishlist([...wishlist, item]);
      toast({
        title: 'Added to Wishlist',
        description: `${item.name} has been added to your wishlist.`,
      });
    } else {
      toast({
        title: 'Already in Wishlist',
        description: `${item.name} is already in your wishlist.`,
      });
    }
  };
  
  // Function to remove an item from wishlist
  const removeFromWishlist = (id: string) => {
    const itemName = wishlist.find(item => item.id === id)?.name || 'Item';
    setWishlist(wishlist.filter(item => item.id !== id));
    toast({
      title: 'Removed from Wishlist',
      description: `${itemName} has been removed from your wishlist.`,
    });
  };
  
  // Function to check if an item is in wishlist
  const isInWishlist = (id: string) => {
    return wishlist.some(item => item.id === id);
  };
  
  // Function to clear the wishlist
  const clearWishlist = () => {
    setWishlist([]);
    toast({
      title: 'Wishlist Cleared',
      description: 'All items have been removed from your wishlist.',
    });
  };
  
  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        clearWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};
