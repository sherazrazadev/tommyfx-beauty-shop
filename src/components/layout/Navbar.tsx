import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search, Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';
import { useWishlist } from '@/components/wishlist/useWishlist'; // Add this import

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  const { wishlist } = useWishlist(); // Add this line

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  // Auto-close menu when navigation link is clicked
  // const handleNavClick = () => setIsMenuOpen(false);
  // Add this function after the existing functions
  const handleLinkClick = () => {
    setIsMenuOpen(false); // Close menu when any link is clicked
  };
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  // Search functionality
  const performSearch = async (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, price, image_url, category, description')
        .or(`name.ilike.%${query}%, description.ilike.%${query}%, category.ilike.%${query}%`)
        .limit(5);

      if (error) throw error;
      setSearchResults(data || []);
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleProductClick = (productId: string) => {
    navigate(`/product/${productId}`);
    setIsSearchOpen(false);
    setSearchQuery('');
    setSearchResults([]);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/categories?search=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setSearchResults([]);
    }
  };

  return (
    <header className="bg-tommyfx-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center" onClick={handleLinkClick}>
              <span className="font-serif font-bold text-2xl text-tommyfx-black">
                Tommy<span className="text-tommyfx-blue">FX</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-tommyfx-blue transition-colors" onClick={handleLinkClick}>Home</Link>
            <Link to="/categories" className="font-medium hover:text-tommyfx-blue transition-colors" onClick={handleLinkClick}>Shop</Link>
            <Link to="/about" className="font-medium hover:text-tommyfx-blue transition-colors" onClick={handleLinkClick}>About</Link>
            <Link to="/contact" className="font-medium hover:text-tommyfx-blue transition-colors" onClick={handleLinkClick} >Contact</Link>
            {/* Support Dropdown */}
            <div className="relative group">
              <button className="font-medium hover:text-tommyfx-blue transition-colors flex items-center">
                Support
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              
              {/* Dropdown Menu */}
              <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="py-2">
                  <Link to="/support/faq" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-tommyfx-blue" onClick={handleLinkClick}>
                    FAQs
                  </Link>
                  <Link to="/support/track-order" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-tommyfx-blue" onClick={handleLinkClick}>
                    Track Order
                  </Link>
                  <Link to="/support/privacy-policy" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-tommyfx-blue" onClick={handleLinkClick}>
                    Privacy Policy
                  </Link>
                  <Link to="/support/terms-conditions" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-tommyfx-blue" onClick={handleLinkClick}>
                    Terms & Conditions
                  </Link>
                </div>
              </div>
            </div>
          </nav>

          {/* Right Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={toggleSearch}
              className="p-2 hover:text-tommyfx-blue transition-colors"
              aria-label="Search"
            >
              <Search size={20} />
            </button>
            
            <Link 
              to="/profile" 
              className="p-2 hover:text-tommyfx-blue transition-colors hidden sm:block"
              aria-label="User account"
            >
              <User size={20} />
            </Link>
            {/* Wishlist Icon */}
            <Link 
              to="/wishlist" 
              className="p-2 hover:text-tommyfx-blue transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart size={20} />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </Link>
            <Link 
              to="/cart" 
              className="p-2 hover:text-tommyfx-blue transition-colors relative"
              aria-label="Shopping cart"
            >
              <ShoppingCart size={20} />
              <span className="absolute -top-1 -right-1 bg-tommyfx-blue text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {cartItemCount}
              </span>
            </Link>
            
            <button 
              className="p-2 md:hidden hover:text-tommyfx-blue transition-colors"
              onClick={toggleMenu}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Functional Search Bar */}
        {isSearchOpen && (
          <div className="pt-4 animate-fade-in relative">
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products by name, category, or description..."
                  value={searchQuery}
                  onChange={handleSearchInputChange}
                  className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue pr-10"
                  autoFocus
                />
                <button 
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 hover:text-tommyfx-blue"
                >
                  <Search size={20} className="text-gray-400" />
                </button>
              </div>
            </form>

            {/* Search Results Dropdown */}
            {(searchResults.length > 0 || isSearching) && (
              <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-md shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                {isSearching ? (
                  <div className="p-4 text-center text-gray-500">
                    Searching...
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleProductClick(product.id)}
                        className="flex items-center p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                      >
                        <img
                          src={product.image_url || 'https://source.unsplash.com/oG8PIWBc3nE'}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded mr-3"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-sm">{product.name}</h4>
                          <p className="text-xs text-gray-500">{product.category}</p>
                          <p className="text-sm font-semibold text-tommyfx-blue">
                            Rs. {product.price}
                          </p>
                        </div>
                      </div>
                    ))}
                    {searchQuery && (
                      <div 
                        onClick={() => handleSearchSubmit(new Event('submit') as any)}
                        className="p-3 text-center text-tommyfx-blue hover:bg-gray-50 cursor-pointer border-t"
                      >
                        View all results for "{searchQuery}"
                      </div>
                    )}
                  </>
                ) : searchQuery ? (
                  <div className="p-4 text-center text-gray-500">
                    No products found for "{searchQuery}"
                  </div>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation - Auto-close on link click */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-medium p-2 hover:bg-gray-50 rounded-md">Home</Link>
              <Link to="/categories" className="font-medium p-2 hover:bg-gray-50 rounded-md">Shop</Link>
              <Link to="/about" className="font-medium p-2 hover:bg-gray-50 rounded-md">About</Link>
              <Link to="/contact" className="font-medium p-2 hover:bg-gray-50 rounded-md">Contact</Link>
              
              {/* Mobile Support Links */}
              <div className="border-t pt-2 mt-2">
                <p className="text-sm font-medium text-gray-500 px-2 mb-2">Support</p>
                <Link to="/support/faq" className="font-medium p-2 hover:bg-gray-50 rounded-md block pl-4">FAQs</Link>
                <Link to="/support/track-order" className="font-medium p-2 hover:bg-gray-50 rounded-md block pl-4">Track Order</Link>
                <Link to="/support/privacy-policy" className="font-medium p-2 hover:bg-gray-50 rounded-md block pl-4">Privacy Policy</Link>
                <Link to="/support/terms-conditions" className="font-medium p-2 hover:bg-gray-50 rounded-md block pl-4">Terms & Conditions</Link>
              </div>
              
              <Link to="/profile" className="font-medium p-2 hover:bg-gray-50 rounded-md">My Account</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;