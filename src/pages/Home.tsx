
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShoppingBag, Truck, Award, RefreshCw, Instagram } from 'lucide-react';
import ProductCard from '@/components/ui/ProductCard';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { useState } from 'react';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [newArrivals, setNewArrivals] = useState<any[]>([]);
  const [testimonials, setTestimonials] = useState([
    {
      name: 'Emma Thompson',
      rating: 5,
      comment: 'I\'ve tried many beauty products before, but TommyFX\'s skincare line has completely transformed my skin! I\'ve never received so many compliments.',
      date: 'May 15, 2025'
    },
    {
      name: 'Sarah Johnson',
      rating: 4,
      comment: 'The foundation stays on all day and looks so natural. I\'m impressed with the quality for the price point.',
      date: 'April 23, 2025'
    },
    {
      name: 'Michael Chen',
      rating: 5,
      comment: 'I bought the hair products for my wife and she loves them! The customer service was also fantastic.',
      date: 'June 1, 2025'
    }
  ]);

  const instagramPosts = [
    'https://source.unsplash.com/WMPJGp3FeGM',
    'https://source.unsplash.com/81n9G9I_JMQ',
    'https://source.unsplash.com/8HK5BxgKysA',
    'https://source.unsplash.com/6YM5Mf5i_o8',
    'https://source.unsplash.com/Hqk6JF_IgcE',
    'https://source.unsplash.com/_H0fjILH5Vw'
  ];

  const [animatedElements, setAnimatedElements] = useState<Element[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    // Fetch products from Supabase
    const fetchProducts = async () => {
      try {
        // Fetch all products
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          // Split products into featured and new arrivals
          const featured = data.slice(0, 4);
          const newOnes = data.slice(4, 8);
          
          setFeaturedProducts(featured);
          setNewArrivals(newOnes.length > 0 ? newOnes : featured); // Use featured as fallback
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    
    fetchProducts();
  }, []);

  useEffect(() => {
    // Set up intersection observer for animations
    observerRef.current = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-fade-in');
          observerRef.current?.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    // Get all elements with the 'js-animate' class
    const elements = document.querySelectorAll('.js-animate');
    elements.forEach(el => {
      el.classList.add('opacity-0');
      observerRef.current?.observe(el);
    });
    
    setAnimatedElements(Array.from(elements));

    return () => {
      if (observerRef.current) {
        animatedElements.forEach(el => {
          observerRef.current?.unobserve(el);
        });
      }
    };
  }, [animatedElements.length]);

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-gray-100 to-gray-200 py-20 md:py-32">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row items-center">
            <div className="lg:w-1/2 lg:pr-12 text-center lg:text-left mb-10 lg:mb-0">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Discover Your Natural 
                <span className="text-tommyfx-blue"> Beauty</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 max-w-lg mx-auto lg:mx-0">
                Premium beauty products crafted with natural ingredients to enhance your unique beauty.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" className="btn-primary text-lg" asChild>
                  <Link to="/categories">Shop Now</Link>
                </Button>
                <Button variant="outline" size="lg" className="btn-outline text-lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="lg:w-1/2 relative">
              <div className="relative z-10 rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://source.unsplash.com/dHYFpRXPL48" 
                  alt="TommyFX Beauty Products" 
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-64 h-64 bg-tommyfx-blue rounded-full opacity-20 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature boxes */}
            <div className="flex items-center p-6 bg-gray-50 rounded-lg js-animate">
              <ShoppingBag className="text-tommyfx-blue w-12 h-12 mr-4" />
              <div>
                <h3 className="font-medium text-lg mb-1">Free Shipping</h3>
                <p className="text-gray-600">On orders above $50</p>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-gray-50 rounded-lg js-animate">
              <RefreshCw className="text-tommyfx-blue w-12 h-12 mr-4" />
              <div>
                <h3 className="font-medium text-lg mb-1">Easy Returns</h3>
                <p className="text-gray-600">30-day return policy</p>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-gray-50 rounded-lg js-animate">
              <Award className="text-tommyfx-blue w-12 h-12 mr-4" />
              <div>
                <h3 className="font-medium text-lg mb-1">Quality Products</h3>
                <p className="text-gray-600">Tested and approved</p>
              </div>
            </div>
            
            <div className="flex items-center p-6 bg-gray-50 rounded-lg js-animate">
              <Truck className="text-tommyfx-blue w-12 h-12 mr-4" />
              <div>
                <h3 className="font-medium text-lg mb-1">Fast Delivery</h3>
                <p className="text-gray-600">Receive within 2-5 days</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 bg-gray-50 js-animate">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/categories" className="flex items-center text-tommyfx-blue hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="product-grid">
            {featuredProducts.map((product) => (
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
        </div>
      </section>

      {/* Banner Section */}
      <section className="py-24 bg-tommyfx-blue js-animate">
        <div className="container-custom">
          <div className="text-center text-white max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">
              Natural Ingredients. Beautiful Results.
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Our products are formulated with the highest quality natural ingredients, 
              free from harmful chemicals and cruelty-free.
            </p>
            <Button size="lg" className="bg-white text-tommyfx-blue hover:bg-gray-100">
              Learn About Our Ingredients
            </Button>
          </div>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className="py-16 bg-white js-animate">
        <div className="container-custom">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">New Arrivals</h2>
            <Link to="/categories" className="flex items-center text-tommyfx-blue hover:underline">
              View All <ArrowRight size={16} className="ml-1" />
            </Link>
          </div>
          
          <div className="product-grid">
            {newArrivals.map((product) => (
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
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-gray-50 js-animate">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-8 text-center">What Our Customers Say</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard
                key={index}
                name={testimonial.name}
                rating={testimonial.rating}
                comment={testimonial.comment}
                date={testimonial.date}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Instagram Feed Section */}
      <section className="py-16 bg-white js-animate">
        <div className="container-custom">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-3">Follow Us on Instagram</h2>
            <p className="text-gray-600">@tommyfx_beauty</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramPosts.map((image, index) => (
              <a key={index} href="#" className="block group relative aspect-square overflow-hidden">
                <img 
                  src={image} 
                  alt={`Instagram post ${index + 1}`}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                />
                <div className="absolute inset-0 bg-tommyfx-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity flex items-center justify-center">
                  <Instagram className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </a>
            ))}
          </div>
          
          <div className="mt-8 text-center">
            <a href="#" className="btn-outline inline-flex items-center">
              <Instagram size={18} className="mr-2" /> Follow on Instagram
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
