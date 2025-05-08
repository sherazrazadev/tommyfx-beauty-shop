
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Filter, X } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const Categories = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const toggleFilter = () => setFilterOpen(!filterOpen);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        if (data) {
          setProducts(data);
          
          // Extract unique categories
          const uniqueCategories = Array.from(new Set(data.map(product => product.category)))
            .filter(Boolean)
            .map(category => ({
              id: category?.toLowerCase(),
              name: category,
              image: data.find(p => p.category === category)?.image_url,
              productCount: data.filter(p => p.category === category).length
            }));
          
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category?.toLowerCase() === selectedCategory.toLowerCase())
    : products;
  
  const filteredByPrice = filteredProducts.filter(
    product => product.price >= priceRange.min && product.price <= priceRange.max
  );

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gray-100 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Shop Our Collection</h1>
            <div className="flex items-center justify-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-800">Shop</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Filter Sidebar */}
            <aside className={`w-full md:w-64 bg-white p-5 rounded-lg shadow-md ${filterOpen ? 'block' : 'hidden md:block'}`}>
              <div className="flex justify-between items-center md:hidden mb-4">
                <h3 className="text-xl font-medium">Filters</h3>
                <Button variant="ghost" size="sm" onClick={toggleFilter}>
                  <X size={20} />
                </Button>
              </div>
              
              {/* Category Filter */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Categories</h4>
                <div className="space-y-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === null}
                      onChange={() => setSelectedCategory(null)}
                      className="mr-2"
                    />
                    <span>All Categories</span>
                  </label>
                  {categories.map(category => (
                    <label key={category.id} className="flex items-center">
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === category.id}
                        onChange={() => setSelectedCategory(category.id)}
                        className="mr-2"
                      />
                      <span>{category.name}</span>
                    </label>
                  ))}
                </div>
              </div>
              
              {/* Price Filter */}
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Price Range</h4>
                <div className="space-y-2">
                  <div>
                    <label htmlFor="min-price" className="block text-sm mb-1">Min Price: ${priceRange.min}</label>
                    <input
                      type="range"
                      id="min-price"
                      min="0"
                      max="50"
                      value={priceRange.min}
                      onChange={e => setPriceRange({ ...priceRange, min: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label htmlFor="max-price" className="block text-sm mb-1">Max Price: ${priceRange.max}</label>
                    <input
                      type="range"
                      id="max-price"
                      min="0"
                      max="100"
                      value={priceRange.max}
                      onChange={e => setPriceRange({ ...priceRange, max: parseInt(e.target.value) })}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
              
              <Button className="w-full btn-primary">Apply Filters</Button>
            </aside>

            {/* Products Grid */}
            <div className="w-full md:flex-1">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">All Products</h2>
                <div className="flex items-center">
                  <Button variant="ghost" className="md:hidden mr-2" onClick={toggleFilter}>
                    <Filter size={20} className="mr-2" /> Filters
                  </Button>
                  <select className="border rounded-md p-2 text-sm">
                    <option>Sort by: Featured</option>
                    <option>Price: Low to High</option>
                    <option>Price: High to Low</option>
                    <option>Newest</option>
                  </select>
                </div>
              </div>
              
              {loading ? (
                <div className="flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
                </div>
              ) : filteredByPrice.length > 0 ? (
                <div className="product-grid">
                  {filteredByPrice.map(product => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image_url}
                      category={product.category}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <h3 className="text-xl mb-2">No products found</h3>
                  <p className="text-gray-600 mb-4">Try adjusting your filters</p>
                  <Button onClick={() => {
                    setSelectedCategory(null);
                    setPriceRange({ min: 0, max: 50 });
                  }}>
                    Reset Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Categories;
