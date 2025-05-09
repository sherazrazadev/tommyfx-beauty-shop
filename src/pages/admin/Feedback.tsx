
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
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
};

const FeedbackPage = () => {
  const [feedbackItems, setFeedbackItems] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterApproved, setFilterApproved] = useState(false);
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect if not admin
    if (!isAdmin && !loading) {
      toast({
        title: "Access denied",
        description: "You do not have permission to access this page",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  const fetchFeedback = async () => {
    setLoading(true);
    try {
      // First get all feedback items
      const queryFeedback = supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });
        
      if (filterApproved) {
        queryFeedback.eq('approved', true);
      }
      
      const { data: feedbackData, error: feedbackError } = await queryFeedback;
      
      if (feedbackError) throw feedbackError;
      
      // If we have feedback data, get the user profiles separately
      if (feedbackData && feedbackData.length > 0) {
        // Get unique user IDs
        const userIds = feedbackData
          .map(item => item.user_id)
          .filter((id): id is string => id !== null);
          
        // Fetch profiles for these users if we have any user IDs
        const formattedFeedback: FeedbackItem[] = [...feedbackData];
        
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
              } else {
                item.user_name = 'Anonymous';
                item.user_email = 'No email';
              }
            });
          }
        } else {
          // Set default values for items without user_id
          formattedFeedback.forEach(item => {
            item.user_name = 'Anonymous';
            item.user_email = 'No email';
          });
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
    if (user) {
      fetchFeedback();
    }
  }, [user, filterApproved]);
  
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
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
      </div>
    );
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
