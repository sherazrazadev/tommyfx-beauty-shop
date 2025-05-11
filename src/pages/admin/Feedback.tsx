
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Card } from '@/components/ui/card';
import AdminLayout from '@/components/layout/AdminLayout';

type FeedbackItem = {
  id: string;
  comment: string;
  rating: number;
  created_at: string;
  user_id: string;
  approved: boolean;
  user_name?: string;
  user_email?: string;
  product_id?: string | null;
  product_name?: string | null;
};

const FeedbackPage = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterApproved, setFilterApproved] = useState(false);
  const { isAdmin, user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait for auth to be ready
    if (authLoading) return;
    
    // Redirect if not admin
    if (!isAdmin) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page",
        variant: "destructive"
      });
      navigate('/');
    } else if (user) {
      // Only fetch feedback if user is authenticated and admin
      fetchFeedback();
    }
  }, [isAdmin, authLoading, user, navigate]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      // First get all feedback items
      const queryFeedback = supabase
        .from('feedback')
        .select('*, products(name)')
        .order('created_at', { ascending: false });
        
      if (filterApproved) {
        queryFeedback.eq('approved', true);
      }
      
      const { data: feedbackData, error: feedbackError } = await queryFeedback;
      
      if (feedbackError) throw feedbackError;
      
      console.log("Fetched feedback data:", feedbackData);
      
      // If we have feedback data, get the user profiles separately
      if (feedbackData && feedbackData.length > 0) {
        // Get unique user IDs
        const userIds = feedbackData
          .map(item => item.user_id)
          .filter((id): id is string => id !== null);
          
        // Fetch profiles for these users if we have any user IDs
        const formattedFeedback: FeedbackItem[] = feedbackData.map(item => ({
          ...item,
          product_name: item.products?.name || 'General Feedback',
          user_name: 'Anonymous', // Default value
          user_email: 'No email' // Default value
        }));
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name, email')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('Error fetching profiles:', profilesError);
          } else if (profilesData) {
            // Link profile data to feedback items
            formattedFeedback.forEach(item => {
              const userProfile = profilesData.find(profile => profile.id === item.user_id);
              if (userProfile) {
                item.user_name = userProfile.full_name || 'Anonymous';
                item.user_email = userProfile.email || 'No email';
              }
            });
          }
        }
        
        setFeedbackItems(formattedFeedback);
      } else {
        setFeedbackItems([]);
      }
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: "Error",
        description: "Failed to load feedback items",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (user && isAdmin && !authLoading) {
      fetchFeedback();
    }
  }, [user, isAdmin, authLoading, filterApproved]);

  const handleToggleApproval = async (id: string, currentState: boolean) => {
    try {
      const { error } = await supabase
        .from('feedback')
        .update({ approved: !currentState })
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setFeedbackItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, approved: !currentState } : item
        )
      );
      
      toast({
        title: currentState ? "Feedback unapproved" : "Feedback approved",
        description: currentState ? 
          "The feedback will no longer be displayed on the site." :
          "The feedback will now be displayed on the site."
      });
    } catch (error) {
      console.error('Error updating feedback approval:', error);
      toast({
        title: "Error",
        description: "Failed to update feedback approval status",
        variant: "destructive"
      });
    }
  };
  
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this feedback?')) return;
    
    try {
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', id);
        
      if (error) throw error;
      
      // Update local state
      setFeedbackItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Feedback deleted",
        description: "The feedback has been permanently removed"
      });
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive"
      });
    }
  };
  
  // Format date string
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };
  
  // Render star rating
  const renderStars = (rating: number) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };
  
  if (authLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Customer Feedback</h1>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">Show approved only</span>
              <Switch 
                checked={filterApproved} 
                onCheckedChange={setFilterApproved} 
              />
            </div>
            <Button 
              onClick={() => fetchFeedback()} 
              size="sm" 
              variant="outline"
              className="flex items-center gap-1"
            >
              <RefreshCw size={16} />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
        
        <div className="grid gap-4">
          {feedbackItems.length > 0 ? (
            feedbackItems.map((item) => (
              <Card key={item.id} className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
                      <div>
                        <p className="font-medium">{item.user_name || 'Anonymous'}</p>
                        <p className="text-sm text-gray-600">{item.user_email || 'No email'}</p>
                      </div>
                      <div className="text-yellow-500 font-medium">
                        {renderStars(item.rating)}
                      </div>
                    </div>
                    <p className="mt-2 text-sm text-gray-700">{formatDate(item.created_at)}</p>
                    {item.product_name && (
                      <span className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded mt-1">
                        Product: {item.product_name}
                      </span>
                    )}
                    <div className="mt-3 p-3 bg-gray-50 rounded-md">
                      <p className="italic">"{item.comment}"</p>
                    </div>
                  </div>
                  <div className="flex md:flex-col gap-2">
                    <Button
                      variant={item.approved ? "destructive" : "default"}
                      size="sm"
                      className="flex gap-1 items-center"
                      onClick={() => handleToggleApproval(item.id, item.approved)}
                    >
                      {item.approved ? (
                        <>
                          <XCircle size={16} />
                          <span>Unapprove</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle size={16} />
                          <span>Approve</span>
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex gap-1 items-center"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash2 size={16} />
                      <span>Delete</span>
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <div className="text-center p-8 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No feedback found</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default FeedbackPage;
