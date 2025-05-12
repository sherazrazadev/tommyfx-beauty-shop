
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, MessageSquare, CheckCircle, XCircle } from 'lucide-react';
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

interface FeedbackItem {
  id: string;
  created_at: string;
  name: string;
  email: string;
  message: string;
  approved: boolean;
}

// Type for the actual data coming from Supabase
interface SupabaseFeedback {
  id: string;
  created_at: string;
  comment: string;
  user_id: string | null;
  product_id: string | null;
  rating: number;
  approved: boolean;
  user?: { full_name: string; email: string } | null;
}

const Feedback = () => {
  const [feedback, setFeedback] = useState<FeedbackItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    const fetchFeedback = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('feedback')
          .select(`
            *,
            profiles:user_id (
              full_name,
              email
            )
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          throw error;
        }
        
        // Map the Supabase data to our FeedbackItem interface
        const mappedFeedback = (data as unknown as (SupabaseFeedback & { 
          profiles?: { full_name: string; email: string } | null 
        })[]).map(item => ({
          id: item.id,
          created_at: item.created_at,
          name: item.profiles?.full_name || 'Anonymous User',
          email: item.profiles?.email || 'No Email',
          message: item.comment,
          approved: item.approved || false
        }));
        
        setFeedback(mappedFeedback);
      } catch (error) {
        console.error('Error fetching feedback:', error);
        toast({
          title: 'Error',
          description: 'Failed to load feedback data',
          variant: 'destructive'
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchFeedback();
  }, []);

const updateFeedbackStatus = async (id: string, approved: boolean) => {
  try {
    setUpdating(true);
    const { error } = await supabase
      .from('feedback')
      .update({ approved, updated_at: new Date().toISOString() })
      .eq('id', id);
      
    if (error) throw error;
    
    // Update local state without refetching
    setFeedback(prev => 
      prev.map(item => 
        item.id === id ? { ...item, approved } : item
      )
    );
    
    toast({
      title: approved ? "Feedback Approved" : "Feedback Unapproved",
      description: approved ? "Feedback is now public" : "Feedback has been hidden",
    });
  } catch (error) {
    console.error('Error updating feedback status:', error);
    toast({
      title: "Error",
      description: "Failed to update feedback status",
      variant: "destructive"
    });
  } finally {
    setUpdating(false);
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
                  <TableHead>Date</TableHead>
                  <TableHead className="w-14 text-center">Approved</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {feedback.length > 0 ? (
                  feedback.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell className="font-medium">{item.name}</TableCell>
                      <TableCell>{item.email}</TableCell>
                      <TableCell className="max-w-md break-words">{item.message}</TableCell>
                      <TableCell>{formatDate(item.created_at)}</TableCell>
                      <TableCell className="text-center">
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={updating}
                          onClick={() => updateFeedbackStatus(item.id, !item.approved)}
                        >
                          {item.approved ? (
                            <CheckCircle className="text-green-500" size={20} />
                          ) : (
                            <XCircle className="text-red-500" size={20} />
                          )}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-6">
                      No feedback found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default Feedback;
