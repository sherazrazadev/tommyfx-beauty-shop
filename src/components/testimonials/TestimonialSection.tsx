
import React, { useState, useEffect, useRef } from 'react';
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
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [maxScroll, setMaxScroll] = useState(0);
  
  // Amount to scroll in each direction
  const scrollAmount = 300;

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
  
  useEffect(() => {
    // Calculate max scroll position when testimonials change or on resize
    const updateMaxScroll = () => {
      if (scrollContainerRef.current) {
        const containerWidth = scrollContainerRef.current.scrollWidth;
        const visibleWidth = scrollContainerRef.current.clientWidth;
        setMaxScroll(containerWidth - visibleWidth);
      }
    };
    
    updateMaxScroll();
    
    // Update max scroll on window resize
    window.addEventListener('resize', updateMaxScroll);
    return () => window.removeEventListener('resize', updateMaxScroll);
  }, [testimonials]);
  
  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.max(scrollPosition - scrollAmount, 0);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const newPosition = Math.min(scrollPosition + scrollAmount, maxScroll);
      scrollContainerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
      setScrollPosition(newPosition);
    }
  };
  
  // Handle scroll event to update scroll position state
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      setScrollPosition(scrollContainerRef.current.scrollLeft);
    }
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
          <button 
            onClick={scrollLeft} 
            disabled={scrollPosition === 0} 
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg ${scrollPosition === 0 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Previous testimonials"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            onClick={scrollRight} 
            disabled={scrollPosition >= maxScroll} 
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white p-2 rounded-full shadow-lg ${scrollPosition >= maxScroll ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'}`}
            aria-label="Next testimonials"
          >
            <ChevronRight size={24} />
          </button>

          {/* Scrollable container for testimonials */}
          <div 
            ref={scrollContainerRef} 
            onScroll={handleScroll}
            className="flex overflow-x-auto gap-6 px-10 pb-4 scrollbar-hide scroll-smooth snap-x"
          >
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="min-w-[300px] md:min-w-[350px] flex-shrink-0 snap-center">
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
      </div>
    </div>
  );
};

export default TestimonialSection;
