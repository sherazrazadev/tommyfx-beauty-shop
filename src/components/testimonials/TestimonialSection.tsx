
import React, { useEffect, useState, useRef } from 'react';
import TestimonialCard from '../ui/TestimonialCard';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export type Testimonial = {
  id: string;
  author: string;
  role?: string;
  content: string;
  rating: number;
  product_name?: string;
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchApprovedFeedback = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select(`
            id, 
            comment, 
            rating, 
            profiles(full_name, email), 
            products(name)
          `)
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) throw error;

        // Map the feedback data to testimonials format
        const mappedTestimonials: Testimonial[] = (data || []).map(item => ({
          id: item.id,
          author: item.profiles?.full_name || 'Anonymous Customer',
          role: item.products?.name ? `on ${item.products.name}` : 'on TommyFX Beauty',
          content: item.comment,
          rating: item.rating,
          product_name: item.products?.name
        }));

        console.log('Fetched testimonials:', mappedTestimonials);
        setTestimonials(mappedTestimonials);
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApprovedFeedback();
  }, []);

  // Scroll left and right handlers
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: 'smooth' });
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-16">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">Customer Testimonials</h2>
          <p className="text-gray-600">What our customers are saying</p>
        </div>
        <div className="flex justify-center">
          <div className="animate-pulse flex space-x-4">
            <div className="rounded-md bg-gray-200 h-40 w-80"></div>
            <div className="rounded-md bg-gray-200 h-40 w-80"></div>
            <div className="rounded-md bg-gray-200 h-40 w-80"></div>
          </div>
        </div>
      </div>
    );
  }

  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  return (
    <div className="bg-white py-16">
      <div className="container-custom">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-serif font-bold mb-2">Customer Testimonials</h2>
          <p className="text-gray-600">What our customers are saying</p>
        </div>
        
        <div className="relative">
          {/* Scroll buttons */}
          <button
            onClick={scrollLeft}
            className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
            aria-label="Scroll left"
          >
            <ChevronLeft size={24} />
          </button>
          
          {/* Testimonials horizontal scroll */}
          <div 
            ref={scrollContainerRef}
            className="flex overflow-x-auto gap-5 pb-4 scrollbar-hide scroll-smooth snap-x"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="flex-shrink-0 snap-start" style={{ width: '350px' }}>
                <TestimonialCard
                  author={testimonial.author}
                  role={testimonial.role}
                  content={testimonial.content}
                  rating={testimonial.rating}
                />
              </div>
            ))}
          </div>
          
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full shadow-md p-2 hover:bg-gray-100 focus:outline-none"
            aria-label="Scroll right"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
