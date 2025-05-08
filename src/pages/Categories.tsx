
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Filter, X } from 'lucide-react';
import CategoryCard from '@/components/ui/CategoryCard';
import ProductCard from '@/components/ui/ProductCard';
import { Button } from '@/components/ui/button';

// Mock data
const categories = [
  {
    id: 'skincare',
    name: 'Skincare',
    image: 'https://source.unsplash.com/1Y_EeeOvzQQ',
    productCount: 12
  },
  {
    id: 'makeup',
    name: 'Makeup',
    image: 'https://source.unsplash.com/UKWFNya-YHk',
    productCount: 18
  },
  {
    id: 'hair',
    name: 'Hair Care',
    image: 'https://source.unsplash.com/eeAZHchRdgA',
    productCount: 9
  },
  {
    id: 'body',
    name: 'Body Care',
    image: 'https://source.unsplash.com/MhOcP0qEZLw',
    productCount: 14
  },
  {
    id: 'fragrance',
    name: 'Fragrance',
    image: 'https://source.unsplash.com/KLfD2eUNGEY',
    productCount: 7
  },
  {
    id: 'bath',
    name: 'Bath & Shower',
    image: 'https://source.unsplash.com/ql3OpWIeYVw',
    productCount: 8
  }
];

const products = [
  {
    id: '1',
    name: 'Hydrating Facial Serum',
    price: 34.99,
    image: 'https://source.unsplash.com/oG8PIWBc3nE',
    category: 'Skincare'
  },
  {
    id: '2',
    name: 'Matte Finish Foundation',
    price: 29.99,
    image: 'https://source.unsplash.com/UKWFNya-YHk',
    category: 'Makeup'
  },
  {
    id: '3',
    name: 'Repairing Hair Mask',
    price: 24.99,
    image: 'https://source.unsplash.com/eeAZHchRdgA',
    category: 'Hair'
  },
  {
    id: '4',
    name: 'Nourishing Body Oil',
    price: 19.99,
    image: 'https://source.unsplash.com/MhOcP0qEZLw',
    category: 'Body'
  },
  {
    id: '5',
    name: 'Anti-Aging Night Cream',
    price: 39.99,
    image: 'https://source.unsplash.com/1Y_EeeOvzQQ',
    category: 'Skincare'
  },
  {
    id: '6',
    name: 'Volumizing Mascara',
    price: 17.99,
    image: 'https://source.unsplash.com/fJTqyZMOh18',
    category: 'Makeup'
  },
  {
    id: '7',
    name: 'Soothing Bath Bombs',
    price: 14.99,
    image: 'https://source.unsplash.com/ql3OpWIeYVw',
    category: 'Bath'
  },
  {
    id: '8',
    name: 'Rose Perfume Spray',
    price: 49.99,
    image: 'https://source.unsplash.com/KLfD2eUNGEY',
    category: 'Fragrance'
  },
  {
    id: '9',
    name: 'Exfoliating Face Scrub',
    price: 22.99,
    image: 'https://source.unsplash.com/mEZ3PoFGs_k',
    category: 'Skincare'
  },
  {
    id: '10',
    name: 'Hydrating Lip Balm',
    price: 12.99,
    image: 'https://source.unsplash.com/eowjK7pqBhk',
    category: 'Makeup'
  },
  {
    id: '11',
    name: 'Heat Protection Spray',
    price: 18.99,
    image: 'https://source.unsplash.com/dKT6Q_koFRw',
    category: 'Hair'
  },
  {
    id: '12',
    name: 'Hand & Nail Cream',
    price: 15.99,
    image: 'https://source.unsplash.com/3jv1r2yj1Po',
    category: 'Body'
  }
];

const Categories = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState({ min: 0, max: 50 });
  
  const toggleFilter = () => setFilterOpen(!filterOpen);
  
  const filteredProducts = selectedCategory 
    ? products.filter(product => product.category.toLowerCase() === selectedCategory.toLowerCase())
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

      {/* Categories Grid */}
      <section className="py-12 bg-white">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <CategoryCard 
                key={category.id}
                id={category.id}
                name={category.name}
                image={category.image}
                productCount={category.productCount}
              />
            ))}
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
              
              {filteredByPrice.length > 0 ? (
                <div className="product-grid">
                  {filteredByPrice.map(product => (
                    <ProductCard
                      key={product.id}
                      id={product.id}
                      name={product.name}
                      price={product.price}
                      image={product.image}
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
