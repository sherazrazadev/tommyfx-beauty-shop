
import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { supabase } from '@/integrations/supabase/client';

type Testimonial = {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  created_at: string;
  approved: boolean;
  profileData?: {
    full_name: string;
  };
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3; // Show 3 testimonials at a time on desktop

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Fetch user profiles for testimonials
          const userIds = data.map(item => item.user_id).filter(Boolean);
          
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
            
          if (profilesError) throw profilesError;
          
          // Combine feedback with user profiles
          const testimonialsWithProfiles = data.map(testimonial => {
            const userProfile = profilesData?.find(profile => profile.id === testimonial.user_id);
            return {
              ...testimonial,
              profileData: {
                full_name: userProfile?.full_name || 'Happy Customer'
              }
            };
          });
          
          setTestimonials(testimonialsWithProfiles);
        }
      } catch (error) {
        console.error('Error fetching testimonials:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchTestimonials();
  }, []);
  
  const handlePrevious = () => {
    setCurrentIndex(prev => Math.max(0, prev - 1));
  };
  
  const handleNext = () => {
    setCurrentIndex(prev => Math.min(testimonials.length - itemsPerPage, prev + 1));
  };
  
  if (loading) {
    return (
      <div className="py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
            <p className="text-gray-600">Loading testimonials...</p>
          </div>
        </div>
      </div>
    );
  }
  
  if (testimonials.length === 0) {
    return null; // Don't show section if no testimonials
  }

  const visibleTestimonials = testimonials.slice(currentIndex, currentIndex + itemsPerPage);

  return (
    <div className="py-16 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm font-medium mb-4">Testimonials</span>
          <h2 className="text-4xl font-bold mb-4">What Our Customers Say</h2>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-400 to-purple-500 mx-auto mb-4"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">See what our valued customers think about our products and services. We pride ourselves on customer satisfaction.</p>
        </div>
        
        <div className="relative">
          {/* Navigation arrows */}
          {testimonials.length > itemsPerPage && (
            <>
              <button 
                onClick={handlePrevious} 
                disabled={currentIndex === 0} 
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Previous testimonials"
              >
                <ChevronLeft size={24} />
              </button>
              <button 
                onClick={handleNext} 
                disabled={currentIndex >= testimonials.length - itemsPerPage} 
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg ${currentIndex >= testimonials.length - itemsPerPage ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
                aria-label="Next testimonials"
              >
                <ChevronRight size={24} />
              </button>
            </>
          )}

          {/* Desktop view */}
          <div className="hidden md:grid grid-cols-3 gap-6 px-10">
            {visibleTestimonials.map((testimonial) => (
              <TestimonialCard
                key={testimonial.id}
                name={testimonial.profileData?.full_name || 'Happy Customer'}
                rating={testimonial.rating}
                comment={testimonial.comment}
                date={new Date(testimonial.created_at).toLocaleDateString()}
              />
            ))}
          </div>
          
          {/* Mobile view (scrollable) */}
          <div className="md:hidden flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-hide">
            {testimonials.map((testimonial) => (
              <div className="min-w-[85%] snap-center" key={testimonial.id}>
                <TestimonialCard
                  name={testimonial.profileData?.full_name || 'Happy Customer'}
                  rating={testimonial.rating}
                  comment={testimonial.comment}
                  date={new Date(testimonial.created_at).toLocaleDateString()}
                />
              </div>
            ))}
          </div>
        </div>
        
        {/* Pagination dots for mobile */}
        <div className="mt-6 flex justify-center md:hidden">
          {Array.from({ length: Math.ceil(testimonials.length / itemsPerPage) }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index * itemsPerPage)}
              className={`w-2 h-2 mx-1 rounded-full ${
                Math.floor(currentIndex / itemsPerPage) === index ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to page ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
