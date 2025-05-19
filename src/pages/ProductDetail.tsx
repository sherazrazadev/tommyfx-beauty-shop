import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { 
  ChevronRight, 
  Star, 
  Minus, 
  Plus, 
  Heart, 
  Share2, 
  ShoppingCart,
  Truck,
  RefreshCw,
  Check,
  X,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import ReviewDialog from '@/components/reviews/ReviewDialog';
import { useWishlist } from '@/components/wishlist/useWishlist'; 
import SocialShareButtons from '@/components/sharing/SocialShareButtons';
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
import { formatCurrency } from '@/lib/utils'; // Add this import at the top

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  // Add these state variables at the top of your component:
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        console.log("Fetching product with ID:", id);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          console.error('Error fetching product:', error);
          throw error;
        }
        
        if (data) {
          console.log("Product data:", data);
          // Set up images array from main image and additional_images
          const mainImage = data.image_url || 'https://source.unsplash.com/oG8PIWBc3nE';
          let images = [mainImage];
          
          // Add additional images if available
          if (data.additional_images && Array.isArray(data.additional_images)) {
            images = [...images, ...data.additional_images];
          }
          
          // Ensure we have at least 4 images for the UI (can be duplicates)
          if (images.length < 4) {
            const fillerCount = 4 - images.length;
            images = [...images, ...Array(fillerCount).fill(mainImage)];
          }
          
          setProduct({
            ...data,
            images,
            details: {
              ingredients: 'Aqua, Glycerin, Sodium Hyaluronate, Tocopherol, Panthenol, Niacinamide, Allantoin, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Ethylhexylglycerin',
              howToUse: 'Apply 2-3 drops to clean, dry skin morning and night. Gently press into skin, following with moisturizer.',
              benefits: ['Deep hydration', 'Improves elasticity', 'Reduces fine lines', 'Brightens complexion']
            }
          });
          
          // Fetch reviews for this product
          await fetchReviews(id);

          // Fetch related products based on category
          if (data.category) {
            await fetchRelatedProducts(data.category, data.id);
          }
        } else {
          console.log("No product found with ID:", id);
        }
      } catch (error) {
        console.error('Error fetching product:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  


  const incrementQuantity = () => setQuantity(prev => prev + 1);
  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (product) {
      addToCart({
        id: product.id,
        name: product.name,
        price: product.discount_price ? product.discount_price : product.price,
        image: product.image_url,
        quantity
      });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
    }
  };
  const fetchReviews = async (productId: string) => {
    try {
      // Get approved feedback for this product
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('product_id', productId)
        .eq('approved', true)
        .order('created_at', { ascending: false });
        
      if (feedbackError) throw feedbackError;
      
      console.log("Fetched reviews for product:", feedbackData);
      
      if (feedbackData && feedbackData.length > 0) {
        // Get user profiles for these reviews
        const userIds = feedbackData
          .map(item => item.user_id)
          .filter((id): id is string => id !== null);
          
        let userProfiles: Record<string, any> = {};
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
            
          if (profilesError) {
            console.error('Error fetching profiles for reviews:', profilesError);
          } else if (profilesData) {
            userProfiles = profilesData.reduce((acc: Record<string, any>, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
          }
        }
        
        // Format the reviews
        const formattedReviews = feedbackData.map(feedback => {
          const profile = userProfiles[feedback.user_id] || {};
          return {
            id: feedback.id,
            name: profile.full_name || 'Happy Customer',
            rating: feedback.rating,
            date: new Date(feedback.created_at).toLocaleDateString(),
            comment: feedback.comment
          };
        });
        
        setReviews(formattedReviews);
        console.log("Formatted reviews:", formattedReviews);
      } else {
        // If no reviews, set an empty array
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };
  const handleOpenReviewDialog = () => {
    if (!user) {
      showNotification("You need to be logged in to write a review.", "error");
      return;
    }
    setReviewDialogOpen(true);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showNotification(`${product.name} has been removed from your wishlist`);
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.discount_price ? product.discount_price : product.price,
        image: product.image_url || product.images[0]
      });
      showNotification(`${product.name} has been added to your wishlist`);
    }
  };

  const handleReviewSubmitted = async () => {
    // After a review is submitted, fetch the reviews again
    if (id) {
      showNotification("Review submitted. Your review will appear after approval by an administrator.");
      await fetchReviews(id);
      setReviewDialogOpen(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
        </div>
      </div>
    );
  }
  
  // Show message if product not found
  if (!product) {
    return (
      <div className="container-custom py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product Not Found</h2>
          <p className="mb-6">The product you are looking for could not be found.</p>
          <Link to="/categories">
            <Button>Browse Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Calculate average rating
  const averageRating = reviews.length > 0 ? 
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  // Current page URL for sharing
  const currentPageUrl = window.location.href;

  // Calculate discount percentage if both prices are available
  const discountPercentage = product.discount_percent && product.price && product.price > 0
    ? Math.round(product.discount_percent)
    : null;

  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-gray-100 py-4">
        <div className="container-custom">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <Link to="/categories" className="text-gray-500 hover:text-tommyfx-blue">
              Shop
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <Link to={`/categories/${product.category?.toLowerCase()}`} className="text-gray-500 hover:text-tommyfx-blue">
              {product.category || 'Products'}
            </Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <span className="text-gray-800">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Product Details */}
      <section className="py-12">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Product Images */}
            <div>
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                {discountPercentage && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
                    -{discountPercentage}%
                  </div>
                )}
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {product.images.slice(0, 4).map((image: string, index: number) => (
                  <button
                    key={index}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      index === activeImageIndex ? 'border-tommyfx-blue' : 'border-transparent'
                    }`}
                    onClick={() => setActiveImageIndex(index)}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
            {/* Review Dialog */}
            {product && (
              <ReviewDialog 
                isOpen={reviewDialogOpen}
                onClose={() => setReviewDialogOpen(false)}
                productId={id || ''}
                productName={product?.name || 'Product'}
                onReviewSubmitted={handleReviewSubmitted}
              />
            )}
            {/* Product Info */}
            <div>
              <span className="text-tommyfx-blue uppercase text-sm font-medium tracking-wide">
                {product.category || 'Product'}
              </span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product?.name || 'Product'}</h1>

              
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      size={18}
                      className={i < Math.round(averageRating) ? "fill-tommyfx-blue text-tommyfx-blue" : "text-gray-300"}
                    />
                  ))}
                </div>
                <span className="ml-2 text-sm text-gray-500">
                  {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                </span>
              </div>
              
              {product.discount_percent ? (
                <div className="mb-6">
                  <p className="text-2xl font-bold text-tommyfx-blue">{formatCurrency(product.price)}</p>
                  <p className="text-gray-500 line-through">{formatCurrency(product.original_price)}</p>
                </div>
              ) : (
                <p className="text-2xl font-bold mb-6">{formatCurrency(product.price)}</p>
              )}

              
              <p className="text-gray-700 mb-6">{product.description}</p>
              
              {/* Product Actions */}
              <div className="mb-6">
                <div className="flex items-center mb-4">
                  <span className="mr-4">Quantity:</span>
                  <div className="flex items-center border rounded-md">
                    <button 
                      onClick={decrementQuantity}
                      className="px-3 py-2 hover:bg-gray-100"
                      aria-label="Decrease quantity"
                    >
                      <Minus size={16} />
                    </button>
                    <span className="px-4 py-2 border-x">{quantity}</span>
                    <button
                      onClick={incrementQuantity}
                      className="px-3 py-2 hover:bg-gray-100"
                      aria-label="Increase quantity"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    className="btn-primary flex items-center justify-center"
                    onClick={handleAddToCart}
                  >
                    <ShoppingCart size={18} className="mr-2" /> Add to Cart
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`btn-outline flex items-center justify-center ${
                      isInWishlist(product.id) ? "bg-gray-100" : ""
                    }`}
                    onClick={handleWishlist}
                  >
                    <Heart 
                      size={18} 
                      className={`mr-2 ${isInWishlist(product.id) ? "fill-tommyfx-blue text-tommyfx-blue" : ""}`} 
                    /> 
                    {isInWishlist(product.id) ? "In Wishlist" : "Add to Wishlist"}
                  </Button>
                </div>
                
                <Button 
                  variant="ghost" 
                  className="mt-3 text-gray-600"
                  onClick={() => setShareDialogOpen(true)}
                >
                  <Share2 size={18} className="mr-2" /> Share
                </Button>
              </div>
              
              {/* Product Features */}
              <div className="space-y-4 border-t pt-6">
                <div className="flex items-center text-sm">
                  <Truck size={18} className="mr-3 text-tommyfx-blue" />
                  <span>Free shipping on orders over $50</span>
                </div>
                <div className="flex items-center text-sm">
                  <RefreshCw size={18} className="mr-3 text-tommyfx-blue" />
                  <span>30-day easy returns</span>
                </div>
                <div className="flex items-center text-sm">
                  <Check size={18} className="mr-3 text-tommyfx-blue" />
                  <span>Cruelty-free & Vegan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Product Tabs */}
      <section className="py-12 bg-gray-50">
        <div className="container-custom">
          <Tabs defaultValue="details">
            <TabsList className="w-full flex border-b mb-8">
              <TabsTrigger value="details" className="flex-1 py-3">Details</TabsTrigger>
              <TabsTrigger value="ingredients" className="flex-1 py-3">Ingredients</TabsTrigger>
              <TabsTrigger value="howToUse" className="flex-1 py-3">How to Use</TabsTrigger>
              <TabsTrigger value="reviews" className="flex-1 py-3">
                Reviews ({reviews.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">Product Details</h3>
                <p className="mb-4">{product.description}</p>
                <h4 className="text-lg font-medium mb-3">Benefits</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {product.details?.benefits?.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">Ingredients</h3>
                <p>{product.details?.ingredients}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="howToUse" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">How to Use</h3>
                <p>{product.details?.howToUse}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium">Customer Reviews</h3>
                  <Button onClick={handleOpenReviewDialog} variant="outline">Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {reviews.length > 0 ? (
                    reviews.map((review) => (
                      <div key={review.id} className="border-b pb-6">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{review.name}</h4>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <div className="flex mb-2">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={16}
                              className={i < review.rating ? "fill-tommyfx-blue text-tommyfx-blue" : "text-gray-300"}
                            />
                          ))}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10 bg-gray-50 rounded">
                      <p className="text-gray-500 mb-2">No reviews yet</p>
                      <p className="text-gray-500 text-sm">Be the first to review this product</p>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          
          {loadingRelated ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {Array(4).fill(null).map((_, idx) => (
                <div key={idx} className="bg-gray-100 rounded-lg animate-pulse h-64"></div>
              ))}
            </div>
          ) : relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(product => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={parseFloat(product.price)}
                  image={product.image_url || 'https://source.unsplash.com/oG8PIWBc3nE'}
                  category={product.category}
                  originalPrice={product.original_price ? parseFloat(product.original_price) : undefined}
                  discountPercent={product.discount_percent ? parseFloat(product.discount_percent) : undefined}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">No related products found.</p>
            </div>
          )}
        </div>
      </section>
      
      {/* Review Dialog */}
      <ReviewDialog 
        isOpen={reviewDialogOpen}
        onClose={() => setReviewDialogOpen(false)}
        productId={id || ''}
        productName={product.name}
        onReviewSubmitted={handleReviewSubmitted}
      />

      {/* Share Dialog */}
      <AlertDialog open={shareDialogOpen} onOpenChange={setShareDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Share this product</AlertDialogTitle>
            <AlertDialogDescription>
              Choose how you'd like to share {product.name}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <SocialShareButtons
              url={currentPageUrl}
              title={product.name}
              description={product.description}
              image={product.images[0]}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Close</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Custom Popup Notification */}
      {showPopup && (
        <div className="fixed top-4 right-4 z-50 w-72 overflow-hidden rounded-md bg-white shadow-lg border border-gray-200 animate-in slide-in-from-top-3">
          <div className={`px-4 py-3 ${
            popupType === 'success' ? 'bg-green-50 border-l-4 border-l-green-500' : 
            popupType === 'error' ? 'bg-red-50 border-l-4 border-l-red-500' : 'bg-blue-50 border-l-4 border-l-blue-500'
          }`}>
            <div className="flex items-center">
              <div className="flex-shrink-0 mr-2">
                {popupType === 'success' ? (
                  <Check className="h-5 w-5 text-green-500" />
                ) : popupType === 'error' ? (
                  <X className="h-5 w-5 text-red-500" />
                ) : (
                  <Info className="h-5 w-5 text-blue-500" />
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm font-medium">
                  {popupMessage}
                </p>
              </div>
              <button
                type="button"
                className="ml-3 flex-shrink-0 text-gray-400 hover:text-gray-500"
                onClick={() => setShowPopup(false)}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetail;