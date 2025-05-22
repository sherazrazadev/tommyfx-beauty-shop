import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/integrations/supabase/client';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const { cart } = useCart();
  const navigate = useNavigate();
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (!isSearchOpen) {
      setSearchQuery('');
      setSearchResults([]);
    }
  };
  
  // Auto-close menu when navigation link is clicked
  const handleNavClick = () => setIsMenuOpen(false);

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
            <Link to="/" className="flex items-center" onClick={handleNavClick}>
              <span className="font-serif font-bold text-2xl text-tommyfx-black">
                Tommy<span className="text-tommyfx-blue">FX</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="font-medium hover:text-tommyfx-blue transition-colors">Home</Link>
            <Link to="/categories" className="font-medium hover:text-tommyfx-blue transition-colors">Shop</Link>
            <Link to="/about" className="font-medium hover:text-tommyfx-blue transition-colors">About</Link>
            <Link to="/contact" className="font-medium hover:text-tommyfx-blue transition-colors">Contact</Link>
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
              <Link 
                to="/" 
                className="font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={handleNavClick}
              >
                Home
              </Link>
              <Link 
                to="/categories" 
                className="font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={handleNavClick}
              >
                Shop
              </Link>
              <Link 
                to="/about" 
                className="font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={handleNavClick}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={handleNavClick}
              >
                Contact
              </Link>
              <Link 
                to="/profile" 
                className="font-medium p-2 hover:bg-gray-50 rounded-md"
                onClick={handleNavClick}
              >
                My Account
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;