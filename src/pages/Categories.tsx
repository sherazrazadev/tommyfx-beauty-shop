
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Search } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Product type
type Product = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  image_url: string;
};

const Categories = () => {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('newest');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  
  // Update category when URL parameter changes
  useEffect(() => {
    const urlCategory = searchParams.get('category') || 'all';
    setCategory(urlCategory);
  }, [searchParams]);

  // Fetch products using React Query
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products', category, sortBy, priceRange, searchQuery],
    queryFn: async () => {
      let query = supabase.from('products').select('*');
      
      // Apply category filter
      if (category !== 'all') {
        query = query.eq('category', category);
      }
      
      // Apply price range filter
      query = query.gte('price', priceRange.min).lte('price', priceRange.max);
      
      // Apply search query
      if (searchQuery) {
        query = query.or(`name.ilike.%${searchQuery}%,description.ilike.%${searchQuery}%`);
      }
      
      // Apply sorting
      if (sortBy === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'price-low') {
        query = query.order('price', { ascending: true });
      } else if (sortBy === 'price-high') {
        query = query.order('price', { ascending: false });
      } else if (sortBy === 'popular') {
        // In a real app, this would use a popularity metric
        query = query.order('id', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    }
  });
  
  // handle search submit
  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container-custom px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Shop Beauty Products</h1>
          <p className="text-gray-600">Find the perfect products for your beauty routine</p>
        </div>
        
        {/* Search Bar */}
        <div className="mb-6">
          <form onSubmit={handleSearchSubmit} className="flex">
            <div className="relative flex-grow">
              <input
                type="text"
                className="w-full pl-10 pr-4 py-3 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-3.5 text-gray-400" size={18} />
            </div>
            <button
              type="submit"
              className="bg-tommyfx-blue text-white px-6 py-3 rounded-r-md hover:bg-blue-600 transition"
            >
              Search
            </button>
          </form>
        </div>
        
        {/* Main Content */}
        <div className="flex flex-col lg:flex-row">
          {/* Sidebar Filters */}
          <div className="lg:w-1/4 pr-0 lg:pr-8">
            {/* Mobile Filter Button */}
            <div className="lg:hidden mb-4">
              <button
                onClick={() => setMobileFiltersOpen(!mobileFiltersOpen)}
                className="flex items-center justify-between w-full p-4 bg-white rounded-md shadow-sm"
              >
                <div className="flex items-center">
                  <Filter size={18} className="mr-2" />
                  <span>Filters</span>
                </div>
                <ChevronDown size={18} className={`transition-transform ${mobileFiltersOpen ? 'rotate-180' : ''}`} />
              </button>
            </div>
            
            {/* Filter Options (hidden on mobile unless expanded) */}
            <div className={`space-y-6 bg-white p-6 rounded-md shadow-sm ${mobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
              {/* Category Filter */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Categories</h3>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'all'}
                      onChange={() => setCategory('all')}
                      className="mr-2"
                    />
                    All Products
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'skincare'}
                      onChange={() => setCategory('skincare')}
                      className="mr-2"
                    />
                    Skin Care
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'makeup'}
                      onChange={() => setCategory('makeup')}
                      className="mr-2"
                    />
                    Make-up
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'haircare'}
                      onChange={() => setCategory('haircare')}
                      className="mr-2"
                    />
                    Hair Care
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={category === 'fragrance'}
                      onChange={() => setCategory('fragrance')}
                      className="mr-2"
                    />
                    Fragrance
                  </label>
                </div>
              </div>
              
              {/* Price Range Filter */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span>${priceRange.min}</span>
                    <span>${priceRange.max}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1000"
                    value={priceRange.max}
                    onChange={(e) => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                    className="w-full"
                  />
                </div>
              </div>
              
              {/* Sort By Options */}
              <div>
                <h3 className="font-semibold text-lg mb-3">Sort By</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="newest">Newest</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="popular">Most Popular</option>
                </select>
              </div>
            </div>
          </div>
          
          {/* Products Grid */}
          <div className="lg:w-3/4 mt-6 lg:mt-0">
            {isLoading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url || '/placeholder.svg'}
                  />
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-md p-8 text-center">
                <h3 className="text-lg font-semibold mb-2">No products found</h3>
                <p className="text-gray-500">
                  Try adjusting your search or filter criteria
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Categories;
