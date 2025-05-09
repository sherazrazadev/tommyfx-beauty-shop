
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import TestimonialSection from '@/components/testimonials/TestimonialSection';

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-rose-100 to-teal-100">
        <div className="container-custom py-24 px-4 flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:w-1/2 max-w-xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover Your Natural Beauty With TommyFX
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Premium beauty products made with organic ingredients. Experience the difference of clean beauty.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/categories">
                <Button size="lg" className="bg-tommyfx-blue hover:bg-blue-700">
                  Shop Now <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/about">
                <Button size="lg" variant="outline">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
          <div className="lg:w-1/2">
            <img 
              src="/placeholder.svg" 
              alt="Beauty Products" 
              className="rounded-lg shadow-md w-full"
            />
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-16">
        <div className="container-custom px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Shop by Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <img src="/placeholder.svg" alt="Skin Care" className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Skin Care</h3>
                <Link to="/categories?category=skincare" className="text-tommyfx-blue hover:underline text-sm">
                  View Products
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <img src="/placeholder.svg" alt="Make-up" className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Make-up</h3>
                <Link to="/categories?category=makeup" className="text-tommyfx-blue hover:underline text-sm">
                  View Products
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <img src="/placeholder.svg" alt="Hair Care" className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Hair Care</h3>
                <Link to="/categories?category=haircare" className="text-tommyfx-blue hover:underline text-sm">
                  View Products
                </Link>
              </div>
            </div>
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
              <img src="/placeholder.svg" alt="Fragrance" className="w-full h-48 object-cover rounded-t-lg" />
              <div className="p-4">
                <h3 className="font-medium text-lg mb-2">Fragrance</h3>
                <Link to="/categories?category=fragrance" className="text-tommyfx-blue hover:underline text-sm">
                  View Products
                </Link>
              </div>
            </div>
          </div>
          <div className="text-center mt-10">
            <Link to="/categories">
              <Button>
                View All Categories <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
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
                <div className="w-16 h-16 bg-tommyfx-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">All Natural</h3>
                <p className="text-gray-600">Made with organic ingredients sourced from trusted suppliers.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-tommyfx-blue rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                    <circle cx="12" cy="12" r="10" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold mb-2">Quality Tested</h3>
                <p className="text-gray-600">Every product undergoes rigorous testing for safety and effectiveness.</p>
              </div>
              <div>
                <div className="w-16 h-16 bg-tommyfx-blue rounded-full flex items-center justify-center mx-auto mb-4">
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

      {/* Newsletter Section */}
      <section className="py-16 bg-tommyfx-blue text-white">
        <div className="container-custom px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Join Our Beauty Community</h2>
            <p className="mb-8">
              Subscribe to our newsletter for exclusive offers, beauty tips, and early access to new product launches.
            </p>
            <form className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Your email address"
                className="px-4 py-3 flex-1 rounded-md text-gray-900 focus:outline-none"
                required
              />
              <Button className="bg-white text-tommyfx-blue hover:bg-gray-100">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
