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
  Clock,
  Package
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import ProductCard from '@/components/ui/ProductCard';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import ReviewDialog from '@/components/reviews/ReviewDialog';
import { useWishlist } from '@/components/wishlist/useWishlist'; 
import SocialShareButtons from '@/components/sharing/SocialShareButtons';
import { Product } from '@/types/index';
import { formatCurrency } from '@/lib/utils';
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

// Countdown Timer Component
const CountdownTimer: React.FC<{ initialMinutes?: number }> = ({ initialMinutes = 29 }) => {
  const [timeLeft, setTimeLeft] = useState({
    hours: Math.floor(initialMinutes / 60),
    minutes: initialMinutes % 60,
    seconds: Math.floor(Math.random() * 60)
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        let { hours, minutes, seconds } = prev;
        
        if (seconds > 0) {
          seconds--;
        } else if (minutes > 0) {
          minutes--;
          seconds = 59;
        } else if (hours > 0) {
          hours--;
          minutes = 59;
          seconds = 59;
        } else {
          // Reset timer when it reaches 0
          return {
            hours: Math.floor(initialMinutes / 60),
            minutes: initialMinutes % 60,
            seconds: Math.floor(Math.random() * 60)
          };
        }
        
        return { hours, minutes, seconds };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [initialMinutes]);

  return (
    <div className="flex items-center gap-1 text-white font-mono text-sm">
      <Clock size={14} />
      {String(timeLeft.hours).padStart(2, '0')}:
      {String(timeLeft.minutes).padStart(2, '0')}:
      {String(timeLeft.seconds).padStart(2, '0')}
    </div>
  );
};

// Discount Highlight Bar Component
const DiscountHighlight: React.FC<{ discountPercent: number }> = ({ discountPercent }) => {
  return (
    <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-lg p-3 mb-6 flex items-center justify-between text-white shadow-lg">
      <div className="flex items-center gap-2">
        <div className="bg-white/20 rounded-full px-3 py-1">
          <span className="font-bold text-lg">{Math.round(discountPercent)}% OFF</span>
        </div>
        <span className="font-medium">Limited Time Offer!</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-sm opacity-90">Offer ends in:</span>
        <CountdownTimer />
      </div>
    </div>
  );
};

// Stock Display Component
const StockDisplay: React.FC<{ stock: number }> = ({ stock }) => {
  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-600 bg-red-50';
    if (stock <= 5) return 'text-orange-600 bg-orange-50';
    if (stock <= 10) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getStockText = (stock: number) => {
    if (stock === 0) return 'Out of Stock';
    if (stock <= 5) return `Only ${stock} left!`;
    if (stock <= 10) return `${stock} in stock`;
    return `${stock} available`;
  };

  return (
    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${getStockColor(stock)}`}>
      <Package size={14} />
      {getStockText(stock)}
    </div>
  );
};

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error || !data) throw error || new Error('Product not found');

        const mainImage = data.image_url || 'https://source.unsplash.com/oG8PIWBc3nE';
        let images = [mainImage];
        if (Array.isArray(data.additional_images)) images.push(...data.additional_images);
        if (images.length < 4) images.push(...Array(4 - images.length).fill(mainImage));

        setProduct({ ...data, images });
        await fetchReviews(data.id);
        fetchRelated(data.category, data.id);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

    // In ProductDetail.tsx - add this function and call it in useEffect
  const refreshProductData = async () => {
    if (!id) return;
    
    try {
      const { data, error } = await supabase
        .from('products')
        .select('stock')
        .eq('id', id)
        .single();
      
      if (!error && data && product) {
        setProduct(prev => ({ ...prev, stock: data.stock }));
      }
    } catch (error) {
      console.error('Error refreshing product data:', error);
    }
  };
  // Add this to the existing useEffect or create a new one
  useEffect(() => {
    // Refresh stock when component mounts
    const interval = setInterval(refreshProductData, 5000); // Refresh every 5 seconds
    return () => clearInterval(interval);
  }, [id, product]);
  
  // In ProductDetail.tsx - add this useEffect
  useEffect(() => {
    const handleStorageChange = () => {
      const stockUpdated = localStorage.getItem('stockUpdated');
      if (stockUpdated) {
        refreshProductData();
        localStorage.removeItem('stockUpdated');
      }
    };

    window.addEventListener('storage', handleStorageChange);
    // Also check on mount
    handleStorageChange();

    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);
  // In ProductDetail.tsx - update fetchRelated function
  const fetchRelated = async (category: string, currentId: string) => {
    try {
      let { data, error } = await supabase
        .from('products')
        .select('*') // Select all fields to match Product type
        .eq('category', category)
        .neq('id', currentId)
        .limit(4);

      if (error) throw error;

      if (!data || data.length === 0) {
        const fallback = await supabase
          .from('products')
          .select('*') // Select all fields
          .neq('id', currentId)
          .limit(4);
        if (fallback.error) throw fallback.error;
        data = fallback.data;
      }

      setRelatedProducts(data || []);
    } catch (err) {
      console.error('Error fetching related products:', err);
    }
  };

  const fetchReviews = async (productId: string) => {
    try {
      const { data: feedbackData, error: feedbackError } = await supabase
        .from('feedback')
        .select('*')
        .eq('product_id', productId)
        .eq('approved', true)
        .order('created_at', { ascending: false });
        
      if (feedbackError) throw feedbackError;
      
      if (feedbackData && feedbackData.length > 0) {
        const userIds = feedbackData
          .map(item => item.user_id)
          .filter((id): id is string => id !== null);
          
        let userProfiles: Record<string, any> = {};
        
        if (userIds.length > 0) {
          const { data: profilesData, error: profilesError } = await supabase
            .from('profiles')
            .select('id, full_name')
            .in('id', userIds);
            
          if (!profilesError && profilesData) {
            userProfiles = profilesData.reduce((acc: Record<string, any>, profile) => {
              acc[profile.id] = profile;
              return acc;
            }, {});
          }
        }
        
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
      } else {
        setReviews([]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  const incrementQuantity = () => {
    if (quantity < product?.stock) {
      setQuantity(prev => prev + 1);
    } else {
      toast({
        title: "Stock Limit Reached",
        description: `Only ${product?.stock} items available`,
        variant: "destructive"
      });
    }
  };

  const decrementQuantity = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

  const handleAddToCart = () => {
    if (!product) return;
    
    if (product.stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable",
        variant: "destructive"
      });
      return;
    }

    if (quantity > product.stock) {
      toast({
        title: "Insufficient Stock",
        description: `Only ${product.stock} items available`,
        variant: "destructive"
      });
      return;
    }

    addToCart({
      id: product.id,
      name: product.name,
      price: product.discount_percent ? product.price : product.price,
      image: product.image_url,
      quantity
    });
    
    toast({
      title: "Added to cart",
      description: `${quantity} x ${product.name} added to your cart`,
      duration: 3000
    });
  };
  
  const handleOpenReviewDialog = () => {
    if (!user) {
      toast({
        title: "Please log in",
        description: "You need to be logged in to write a review.",
        variant: "destructive"
      });
      return;
    }
    setReviewDialogOpen(true);
  };

  const handleWishlist = () => {
    if (!product) return;
    
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      toast({
        title: "Removed from wishlist",
        description: `${product.name} has been removed from your wishlist`,
      });
    } else {
      addToWishlist({
        id: product.id,
        name: product.name,
        price: product.discount_percent ? product.price : product.price,
        image: product.image_url || product.images[0]
      });
      toast({
        title: "Added to wishlist",
        description: `${product.name} has been added to your wishlist`,
      });
    }
  };

  const handleReviewSubmitted = async () => {
    if (id) {
      toast({
        title: "Review submitted",
        description: "Your review will appear after approval by an administrator.",
      });
      await fetchReviews(id);
      setReviewDialogOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="container-custom py-12">
        <div className="flex justify-center items-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
        </div>
      </div>
    );
  }
  
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

  const averageRating = reviews.length > 0 ? 
    reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length : 0;

  const currentPageUrl = window.location.href;
  const discountPercentage = product.discount_percent;

    
  return (
    <div>
      {/* Breadcrumb */}
      <section className="bg-gray-100 py-4">
        <div className="container-custom">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
            <ChevronRight size={16} className="mx-2 text-gray-400" />
            <Link to="/categories" className="text-gray-500 hover:text-tommyfx-blue">Shop</Link>
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
                    -{Math.round(discountPercentage)}%
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

            {/* Product Info */}
            <div>
              <span className="text-tommyfx-blue uppercase text-sm font-medium tracking-wide">
                {product.category || 'Product'}
              </span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
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
                <StockDisplay stock={product.stock || 0} />
              </div>

              {/* Discount Highlight Bar */}
              {discountPercentage && (
                <DiscountHighlight discountPercent={discountPercentage} />
              )}
              
              {product.original_price && product.discount_percent ? (
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
                      disabled={quantity >= product.stock}
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  <span className="ml-3 text-sm text-gray-500">
                    Max: {product.stock}
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Button 
                    className="btn-primary flex items-center justify-center"
                    onClick={handleAddToCart}
                    disabled={product.stock === 0}
                  >
                    <ShoppingCart size={18} className="mr-2" /> 
                    {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
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
                
                {Array.isArray(product.benefits) && product.benefits.length > 0 && (
                  <>
                    <h4 className="text-lg font-medium mb-3">Benefits</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      {product.benefits.map((benefit: string, index: number) => (
                        <li key={index}>{benefit}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">Ingredients</h3>
                <p>{product.ingredients || "Ingredients information not available for this product."}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="howToUse" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">How to Use</h3>
                <p>{product.how_to_use || "Usage instructions not available for this product."}</p>
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
          {relatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {relatedProducts.map(prod => (
                <ProductCard
                  key={prod.id}
                  id={prod.id}
                  name={prod.name}
                  price={prod.discount_percent ? prod.price : prod.price}
                  image={prod.image_url || 'https://source.unsplash.com/oG8PIWBc3nE'}
                  category={prod.category}
                  stock={prod.stock || 0} // Add this line

                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No related products found.</p>
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
    </div>
  );
};

export default ProductDetail;