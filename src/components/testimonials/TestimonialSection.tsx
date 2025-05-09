
import React, { useState, useEffect } from 'react';
import TestimonialCard from '@/components/ui/TestimonialCard';
import { supabase } from '@/integrations/supabase/client';

type Testimonial = {
  id: string;
  rating: number;
  comment: string;
  user_id: string;
  created_at: string;
  profileData?: {
    full_name: string;
  };
};

const TestimonialSection = () => {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select('*')
          .eq('approved', true)
          .order('created_at', { ascending: false })
          .limit(6);
          
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
  
  if (loading) {
    return (
      <div className="py-12 bg-gray-50">
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
    <div className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-2">What Our Customers Say</h2>
          <p className="text-gray-600">Read testimonials from our satisfied customers</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <TestimonialCard
              key={testimonial.id}
              name={testimonial.profileData?.full_name || 'Happy Customer'}
              rating={testimonial.rating}
              comment={testimonial.comment}
              date={new Date(testimonial.created_at).toLocaleDateString()}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSection;
