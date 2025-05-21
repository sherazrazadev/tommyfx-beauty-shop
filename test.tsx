// === ProductDetail.tsx (Part 1 of 2) ===
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
  Check
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

interface Review {
  id: string;
  name: string;
  rating: number;
  date: string;
  comment: string;
}

interface ProductWithImages extends Product {
  images: string[];
}

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState<ProductWithImages | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [shareDialogOpen, setShareDialogOpen] = useState(false);
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { addToWishlist, isInWishlist, removeFromWishlist } = useWishlist();

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

  const fetchRelated = async (category: string, currentId: string) => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('category', category)
        .neq('id', currentId)
        .limit(4);
      if (error) throw error;
      setRelatedProducts(data || []);
    } catch (err) {
      console.error(err);
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
      const formatted = feedbackData.map(f => ({
        id: f.id,
        name: f.user_name || 'Customer',
        rating: f.rating,
        date: new Date(f.created_at).toLocaleDateString(),
        comment: f.comment
      }));
      setReviews(formatted);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  if (loading) return (
    <div className="container-custom py-12">
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue" />
      </div>
    </div>
  );
  if (!product) return <div className="container-custom py-12 text-center">Product not found.</div>;

  const averageRating = reviews.length
    ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
    : 0;
  const discountPercentage = product.discount_percent && product.price
    ? Math.round(product.discount_percent)
    : null;
  const currentPageUrl = window.location.href;

  return (
    <div>
      {/* === Breadcrumb === */}
      <nav className="container-custom py-4 text-sm text-gray-600">
        <Link to="/" className="hover:underline">Home</Link>
        <ChevronRight size={14} className="inline mx-1" />
        <Link to={`/category/${product.category}`} className="hover:underline capitalize">{product.category}</Link>
        <ChevronRight size={14} className="inline mx-1" />
        <span className="capitalize">{product.name}</span>
      </nav>

      {/* === Gallery & Details Columns === */}
      <section className="container-custom grid grid-cols-1 md:grid-cols-2 gap-8 py-12">
        {/* Left: Main Image + Thumbnails */}
        <div>
          <img src={product.images[activeImageIndex]} alt={product.name} className="w-full rounded-lg" />
          <div className="flex mt-4 space-x-2">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`${product.name} ${idx + 1}`}
                onClick={() => setActiveImageIndex(idx)}
                className={`h-20 w-20 object-cover rounded cursor-pointer ${idx === activeImageIndex ? 'ring-2 ring-tommyfx-blue' : ''}`}
              />
            ))}
          </div>
        </div>

        // Right: Info & Actions (Part 2 of 2)
        <div>
          <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
          <div className="flex items-center mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, idx) => (
                <Star
                  key={idx}
                  className={idx < Math.round(averageRating) ? 'text-yellow-500' : 'text-gray-300'}
                />
              ))}
            </div>
            <span className="ml-2 text-sm text-gray-600">({reviews.length} reviews)</span>
          </div>
          <p className="text-xl font-semibold mb-4">
            ${product.discount_price ?? product.price}
            {discountPercentage && (
              <span className="text-sm text-red-500 line-through ml-2">
                ${product.price}
              </span>
            )}
          </p>

          <div className="flex items-center mb-6">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              <Minus />
            </button>
            <span className="mx-4">{quantity}</span>
            <button onClick={() => setQuantity(q => q + 1)}>
              <Plus />
            </button>
          </div>

          <div className="flex space-x-4 mb-6">
            <Button onClick={() => addToCart(product, quantity)}>
              <ShoppingCart className="mr-2" /> Add to Cart
            </Button>
            {isInWishlist(product.id) ? (
              <Button variant="outline" onClick={() => removeFromWishlist(product.id)}>
                <Heart className="text-red-500" /> Remove
              </Button>
            ) : (
              <Button variant="outline" onClick={() => addToWishlist(product)}>
                <Heart className="mr-2" /> Wishlist
              </Button>
            )}
          </div>

          <div className="flex items-center space-x-6 mb-8 text-gray-600">
            <div className="flex items-center">
              <Truck className="mr-2" /> Free shipping
            </div>
            <div className="flex items-center">
              <RefreshCw className="mr-2" /> 30-day returns
            </div>
            {discountPercentage && (
              <div className="flex items-center">
                <Check className="mr-2" /> {discountPercentage}% off
              </div>
            )}
          </div>

          <Tabs defaultValue="description">
            <TabsList>
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({reviews.length})</TabsTrigger>
            </TabsList>
            <TabsContent value="description">
              <p className="text-gray-700">{product.description}</p>
            </TabsContent>
            <TabsContent value="reviews">
              {reviews.map(r => (
                <div key={r.id} className="border-b py-4">
                  <div className="flex items-center">
                    <span className="font-semibold mr-2">{r.name}</span>
                    <span className="text-sm text-gray-500">{r.date}</span>
                  </div>
                  <div className="flex items-center mb-2">
                    {[...Array(5)].map((_, idx) => (
                      <Star
                        key={idx}
                        className={idx < r.rating ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                  </div>
                  <p className="text-gray-600">{r.comment}</p>
                </div>
              ))}
              <Button className="mt-4" onClick={() => setReviewDialogOpen(true)}>
                Leave a Review
              </Button>
            </TabsContent>
          </Tabs>

          <div className="mt-8">
            <SocialShareButtons url={currentPageUrl} />
          </div>

          <ReviewDialog
            open={reviewDialogOpen}
            onClose={() => setReviewDialogOpen(false)}
            productId={product.id}
          />
        </div>
      </section>

      {/* You May Also Like Section */}
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
                  price={prod.discount_price ?? prod.price}
                  image={prod.image_url || 'https://source.unsplash.com/oG8PIWBc3nE'}
                  category={prod.category}
                />
              ))}
            </div>
          ) : (
            <p className="text-center text-gray-500">No related products found.</p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
