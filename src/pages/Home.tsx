
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TestimonialSection from '@/components/testimonials/TestimonialSection';
import ProductCard from '@/components/ui/ProductCard';
import { supabase } from '@/integrations/supabase/client';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(4);
          
        if (error) throw error;
        setFeaturedProducts(data || []);
      } catch (error) {
        console.error('Error fetching featured products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeaturedProducts();
  }, []);

  return (
    <div>
      {/* Modern Hero Section */}
      <section className="bg-gradient-to-r from-blue-50 via-rose-50 to-teal-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-pattern opacity-10"></div>
        <div className="container-custom py-20 md:py-28 px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              Discover Your Natural Beauty
            </h1>
            <p className="text-lg text-gray-700 mb-10">
              Premium beauty products made with organic ingredients. Experience the difference of clean beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/categories">
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline" className="border-2">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-white to-transparent"></div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-3">Featured Products</h2>
          <p className="text-gray-600 text-center max-w-2xl mx-auto mb-10">
            Explore our most popular products, hand-picked for your beauty needs
          </p>
          
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-md p-4 animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-md mb-4"></div>
                  <div className="bg-gray-200 h-4 rounded-md mb-2 w-3/4"></div>
                  <div className="bg-gray-200 h-4 rounded-md w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.length > 0 ? (
                featuredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image_url || '/placeholder.svg'}
                    category={product.category}
                    originalPrice={product.original_price}
                    discountPercent={product.discount_percent}
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-10">
                  <p className="text-gray-500">No products found</p>
                </div>
              )}
            </div>
          )}
          
          <div className="text-center mt-10">
            <Link 
              to="/categories" 
              className="inline-flex items-center text-blue-600 font-medium hover:text-blue-800 transition-colors"
            >
              View All Products <ArrowRight size={16} className="ml-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Add Testimonials Section */}
      <TestimonialSection />

      {/* About Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Why Choose TommyFX Beauty?</h2>
            <p className="text-lg text-gray-700 mb-8">
              At TommyFX Beauty, we believe in the power of clean, organic ingredients that enhance your natural beauty. Our products are cruelty-free, environmentally friendly, and designed to make you feel confident in your own skin.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center mt-12">
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">All Natural</h3>
                <p className="text-gray-600">Made with organic ingredients sourced from trusted suppliers.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Tested</h3>
                <p className="text-gray-600">Every product undergoes rigorous testing for safety and effectiveness.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Cruelty Free</h3>
                <p className="text-gray-600">Never tested on animals and packaged with sustainable materials.</p>
              </div>
            </div>
            <div className="mt-10">
              <Link to="/about">
                <Button variant="outline">
                  Learn More About Us
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
