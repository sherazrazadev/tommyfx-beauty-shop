import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageSquare, CheckCircle, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface FeedbackItem {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  approved: boolean;
  user_id?: string;
  product_id?: string;
  rating?: number;
  product_name?: string;
}

const Feedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null); // Track which item is updating
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [feedbackToDelete, setFeedbackToDelete] = useState<string | null>(null);

  // Function to fetch feedback that can be reused
  const fetchFeedback = async () => {
    try {
      console.log('Fetching feedback data...');
      
      const { data: feedbackData, error } = await supabase
        .from('feedback')
        .select(`
          id, 
          comment, 
          rating,
          user_id,
          product_id,
          created_at,
          approved,
          products(name)
        `)
        .order('created_at', { ascending: false });
        
      if (error) {
        console.error('Error fetching feedback data:', error);
        throw error;
      }
      
      console.log('Feedback data fetched:', feedbackData?.length, feedbackData);
      
      // Process user data for each feedback
      const processedFeedback: FeedbackItem[] = [];
      
      for (const item of feedbackData || []) {
        let name = 'Anonymous User';
        let email = 'No Email';
        
        // If there's a user_id, try to get user info
        if (item.user_id) {
          try {
            const { data: userData, error: userError } = await supabase
              .from('profiles')
              .select('full_name, email')
              .eq('id', item.user_id)
              .single();
              
            if (!userError && userData) {
              name = userData.full_name || name;
              email = userData.email || email;
            }
          } catch (userError) {
            console.error('Error fetching user data:', userError);
          }
        }
        
        // Make sure approved is correctly converted to boolean
        const isApproved = item.approved === true;
        console.log(`Feedback ${item.id} approved state:`, item.approved, isApproved);
        
        processedFeedback.push({
          id: item.id,
          created_at: item.created_at,
          name,
          email,
          message: item.comment,
          approved: isApproved,
          user_id: item.user_id,
          product_id: item.product_id,
          rating: item.rating,
          product_name: item.products?.name || 'General Feedback'
        });
      }
      
      console.log('Processed feedback:', processedFeedback);
      setFeedback(processedFeedback);
      setLoading(false);
      
    } catch (error) {
      console.error('Error fetching feedback:', error);
      toast({
        title: 'Error',
        description: 'Failed to load feedback data',
        variant: 'destructive'
      });
      setLoading(false);
    }
  };

  // Initial data fetch when component mounts
  useEffect(() => {
    setLoading(true);
    fetchFeedback();
  }, []);

  // Function to update feedback approval status
  const updateFeedbackStatus = async (id: string, approved: boolean) => {
    setUpdating(id); // Mark this specific item as updating
    
    try {
      console.log(`Updating feedback ${id} status to ${approved}`);
      
      // Update the database
      const { data, error } = await supabase
        .from('feedback')
        .update({ approved })
        .eq('id', id)
        .select();
        
      if (error) {
        console.error('Error updating feedback status:', error);
        throw error;
      }
      
      console.log('Update response:', data);
      
      // Update local state
      setFeedback(currentFeedback => 
        currentFeedback.map(item => 
          item.id === id ? { ...item, approved } : item
        )
      );
      
      toast({
        title: approved ? "Feedback Approved" : "Feedback Unapproved",
        description: approved ? "Feedback is now public" : "Feedback has been hidden",
      });

      // Verify the update in the database
      const { data: verifyData, error: verifyError } = await supabase
        .from('feedback')
        .select('approved')
        .eq('id', id)
        .single();
        
      if (verifyError) {
        console.error('Error verifying feedback update:', verifyError);
      } else {
        console.log(`Verification: Feedback ${id} approved is now:`, verifyData.approved);
        
        // If database state doesn't match what we expected, refresh the whole list
        if (verifyData.approved !== approved) {
          console.warn('Database state mismatch, refreshing all feedback');
          fetchFeedback();
        }
      }
      
    } catch (error: any) {
      console.error('Error updating feedback status:', error);
      toast({
        title: "Error",
        description: "Failed to update feedback status: " + (error.message || "Unknown error"),
        variant: "destructive"
      });
      
      // Refresh the data to ensure UI is in sync with database
      fetchFeedback();
    } finally {
      setUpdating(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setFeedbackToDelete(id);
    setDeleteDialogOpen(true);
  };

  const deleteFeedback = async () => {
    if (!feedbackToDelete) return;
    
    setUpdating(feedbackToDelete);
    
    try {
      console.log(`Deleting feedback ${feedbackToDelete}`);
      
      const { error } = await supabase
        .from('feedback')
        .delete()
        .eq('id', feedbackToDelete);
        
      if (error) {
        console.error('Error deleting feedback:', error);
        throw error;
      }
      
      // Update local state
      setFeedback(prev => prev.filter(item => item.id !== feedbackToDelete));
      
      toast({
        title: "Feedback Deleted",
        description: "The feedback has been permanently removed",
      });
      
      setDeleteDialogOpen(false);
      
    } catch (error) {
      console.error('Error deleting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to delete feedback",
        variant: "destructive"
      });
      
      // Refresh data to ensure UI is in sync
      fetchFeedback();
    } finally {
      setUpdating(null);
      setFeedbackToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(date);
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Feedback</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Feedback</span>
          </div>
        </div>
        
        <div className="mb-4 flex justify-end">
          <Button onClick={fetchFeedback} variant="outline" size="sm" disabled={loading || updating !== null}>
            Refresh
          </Button>
        </div>
        
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead>Product</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-14 text-center">Approved</TableHead>
                  <TableHead className="w-14 text-center">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.length > 0 ? (
                  feedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="max-w-md break-words">{item.message}</TableCell>
                      <TableCell>{item.product_name}</TableCell>
                      <TableCell>
                        {item.rating ? `${item.rating}/5` : 'N/A'}
                      </TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updating === item.id}
                          onClick={() => updateFeedbackStatus(item.id, !item.approved)}
                          className={updating === item.id ? "opacity-50" : ""}
                        >
                          {item.approved ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <XCircle className="text-red-500" size={20} />
                          )}
                        </Button>
                      </TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updating !== null}
                          onClick={() => handleDeleteClick(item.id)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-6">
                      No feedback found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Feedback</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this feedback? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={updating !== null}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={deleteFeedback}
              className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              disabled={updating !== null}
            >
              {updating === feedbackToDelete ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default Feedback;