
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

interface ReviewDialogProps {
  isOpen: boolean;
  onClose: () => void;
  productId: string;
  productName: string;
  onReviewSubmitted?: () => void;
}

const ReviewDialog: React.FC<ReviewDialogProps> = ({ 
  isOpen, 
  onClose, 
  productId, 
  productName,
  onReviewSubmitted 
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { user } = useAuth();
  
  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to submit a review.",
        variant: "destructive"
      });
      onClose();
      return;
    }
    
    if (comment.trim().length < 5) {
      toast({
        title: "Review too short",
        description: "Please provide a more detailed review.",
        variant: "destructive"
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('feedback')
        .insert({
          user_id: user.id,
          rating,
          comment: comment.trim(),
          product_id: productId,
          approved: false // Reviews require admin approval
        });
      
      if (error) throw error;
      
      toast({
        title: "Review submitted",
        description: "Thank you for your feedback! It will appear after approval."
      });
      
      // Reset form and close dialog
      setRating(5);
      setComment('');
      
      // Call the callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
      onClose();
      
    } catch (error) {
      console.error('Error submitting review:', error);
      toast({
        title: "Submission failed",
        description: "There was an error submitting your review. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Write a Review</DialogTitle>
          <DialogDescription>
            Share your experience with {productName}
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="rating" className="block mb-2">Rating</Label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleRatingChange(star)}
                  className="focus:outline-none"
                >
                  <Star
                    size={24}
                    className={`${
                      star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                    } hover:scale-110 transition-transform`}
                  />
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <Label htmlFor="comment" className="block mb-2">Your Review</Label>
            <Textarea
              id="comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your review here..."
              className="w-full"
              rows={4}
              required
            />
          </div>
          
          <DialogFooter className="sm:justify-between">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              disabled={isSubmitting}
              className="min-w-[100px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ReviewDialog;
