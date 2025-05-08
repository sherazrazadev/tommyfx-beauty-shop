
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Settings, User, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [profileData, setProfileData] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    country: 'United States'
  });
  
  const [loading, setLoading] = useState(false);
  const [feedbackData, setFeedbackData] = useState({
    rating: 5,
    comment: ''
  });

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (user) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
          
          if (error) throw error;
          
          if (data) {
            setProfileData({
              full_name: data.full_name || '',
              email: user.email || '',
              phone: data.phone || '',
              address: data.address || '',
              city: data.city || '',
              state: data.state || '',
              zip: data.zip || '',
              country: data.country || 'United States'
            });
          }
        } catch (error) {
          console.error('Error fetching profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, [user]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
  };
  
  const handleFeedbackChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFeedbackData({
      ...feedbackData,
      [name]: value
    });
  };
  
  const handleRatingChange = (rating: number) => {
    setFeedbackData({
      ...feedbackData,
      rating
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!user) {
        toast({
          title: "Not logged in",
          description: "You need to be logged in to update your profile",
          variant: "destructive"
        });
        navigate('/login');
        return;
      }
      
      const { error } = await supabase
        .from('profiles')
        .update({
          full_name: profileData.full_name,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          state: profileData.state,
          zip: profileData.zip,
          country: profileData.country
        })
        .eq('id', user.id);
      
      if (error) throw error;
      
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully"
      });
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update failed",
        description: error.message || "An error occurred while updating your profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleFeedbackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!feedbackData.comment) {
      toast({
        title: "Comment required",
        description: "Please provide your feedback",
        variant: "destructive"
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Store feedback in Supabase
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user?.id,
          rating: feedbackData.rating,
          comment: feedbackData.comment
        });
      
      if (error) throw error;
      
      toast({
        title: "Feedback sent",
        description: "Thank you for your feedback!"
      });
      
      setFeedbackData({
        rating: 5,
        comment: ''
      });
    } catch (error: any) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Submission failed",
        description: error.message || "An error occurred while sending your feedback",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/');
      toast({
        title: "Logged out",
        description: "You have been logged out successfully"
      });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-gray-50 py-12 min-h-[calc(100vh-5rem)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-500">
                  {profileData.full_name ? profileData.full_name.charAt(0) : user.email?.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold">{profileData.full_name || 'User'}</h2>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-2">
                <a 
                  href="#profile-section" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <User size={18} className="mr-3 text-tommyfx-blue" />
                  <span>My Profile</span>
                </a>
                <a 
                  href="#feedback-section" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <Settings size={18} className="mr-3 text-tommyfx-blue" />
                  <span>Feedback</span>
                </a>
                <button 
                  onClick={handleLogout}
                  className="flex w-full items-center p-3 rounded-md hover:bg-gray-50 text-gray-700 mt-4"
                >
                  <LogOut size={18} className="mr-3 text-red-500" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            {/* Profile Section */}
            <div id="profile-section" className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <h3 className="text-xl font-bold mb-6">Profile Information</h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="full_name" className="block mb-1 font-medium">
                      Full Name
                    </label>
                    <input
                      type="text"
                      id="full_name"
                      name="full_name"
                      value={profileData.full_name}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block mb-1 font-medium">
                      Email Address (cannot be changed)
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={profileData.email}
                      readOnly
                      className="w-full p-3 border rounded-md bg-gray-50"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block mb-1 font-medium">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="address" className="block mb-1 font-medium">
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={profileData.address}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="city" className="block mb-1 font-medium">
                      City
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={profileData.city}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="state" className="block mb-1 font-medium">
                      State
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={profileData.state}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="zip" className="block mb-1 font-medium">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      id="zip"
                      name="zip"
                      value={profileData.zip}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="country" className="block mb-1 font-medium">
                      Country
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={profileData.country}
                      onChange={handleChange}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    >
                      <option value="United States">United States</option>
                      <option value="Canada">Canada</option>
                      <option value="United Kingdom">United Kingdom</option>
                      <option value="Australia">Australia</option>
                      <option value="Germany">Germany</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <Button type="submit" disabled={loading}>
                    {loading ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </div>
            
            {/* Feedback Section */}
            <div id="feedback-section" className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-bold mb-6">Submit Feedback</h3>
              
              <form onSubmit={handleFeedbackSubmit}>
                <div className="mb-6">
                  <label className="block mb-2 font-medium">
                    Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          feedbackData.rating >= star ? 'bg-tommyfx-blue text-white' : 'bg-gray-100 text-gray-600'
                        }`}
                      >
                        {star}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="mb-6">
                  <label htmlFor="comment" className="block mb-2 font-medium">
                    Your Feedback
                  </label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={feedbackData.comment}
                    onChange={handleFeedbackChange}
                    rows={4}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    placeholder="Tell us what you think about our products or service"
                    required
                  />
                </div>
                
                <Button type="submit" disabled={loading}>
                  {loading ? 'Submitting...' : 'Submit Feedback'}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
