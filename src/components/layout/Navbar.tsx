
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, User, Menu, X, Search } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleSearch = () => setIsSearchOpen(!isSearchOpen);

  return (
    <header className="bg-tommyfx-white shadow-sm py-4 sticky top-0 z-50">
      <div className="container-custom">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/" className="flex items-center">
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
                0
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

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="pt-4 animate-fade-in">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <Search size={20} className="text-gray-400" />
              </button>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden pt-4 animate-fade-in">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="font-medium p-2 hover:bg-gray-50 rounded-md">Home</Link>
              <Link to="/categories" className="font-medium p-2 hover:bg-gray-50 rounded-md">Shop</Link>
              <Link to="/about" className="font-medium p-2 hover:bg-gray-50 rounded-md">About</Link>
              <Link to="/contact" className="font-medium p-2 hover:bg-gray-50 rounded-md">Contact</Link>
              <Link to="/profile" className="font-medium p-2 hover:bg-gray-50 rounded-md">My Account</Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
