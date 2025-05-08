
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

// Mock data for reviews and related products - will be replaced later
const reviews = [
  {
    name: 'Sophie L.',
    rating: 5,
    date: 'May 12, 2025',
    comment: "This serum has completely transformed my dry skin. I have been using it for a month and my skin looks so much more plump and hydrated."
  },
  {
    name: 'Michael R.',
    rating: 4,
    date: 'April 30, 2025',
    comment: "Bought this for my wife and she loves it. Says it absorbs quickly and doesn't leave a sticky residue like other serums."
  },
  {
    name: 'Alicia T.',
    rating: 5,
    date: 'April 22, 2025',
    comment: "My new holy grail product! Feels luxurious and my skin has never looked better. Will definitely repurchase."
  }
];

const relatedProducts = [
  {
    id: '5',
    name: 'Anti-Aging Night Cream',
    price: 39.99,
    image: 'https://source.unsplash.com/1Y_EeeOvzQQ',
    category: 'Skincare'
  },
  {
    id: '9',
    name: 'Exfoliating Face Scrub',
    price: 22.99,
    image: 'https://source.unsplash.com/mEZ3PoFGs_k',
    category: 'Skincare'
  },
  {
    id: '2',
    name: 'Matte Finish Foundation',
    price: 29.99,
    image: 'https://source.unsplash.com/UKWFNya-YHk',
    category: 'Makeup'
  },
  {
    id: '10',
    name: 'Hydrating Lip Balm',
    price: 12.99,
    image: 'https://source.unsplash.com/eowjK7pqBhk',
    category: 'Makeup'
  }
];

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [quantity, setQuantity] = useState(1);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) throw error;
        
        if (data) {
          setProduct({
            ...data,
            images: [data.image_url, data.image_url, data.image_url, data.image_url],
            details: {
              ingredients: 'Aqua, Glycerin, Sodium Hyaluronate, Tocopherol, Panthenol, Niacinamide, Allantoin, Aloe Barbadensis Leaf Juice, Phenoxyethanol, Ethylhexylglycerin',
              howToUse: 'Apply 2-3 drops to clean, dry skin morning and night. Gently press into skin, following with moisturizer.',
              benefits: ['Deep hydration', 'Improves elasticity', 'Reduces fine lines', 'Brightens complexion']
            },
            reviews
          });
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
        price: product.price,
        image: product.image_url,
        quantity
      });
      toast({
        title: "Added to cart",
        description: `${quantity} x ${product.name} added to your cart`,
      });
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
  const averageRating = 
    product.reviews.reduce((sum: number, review: any) => sum + review.rating, 0) / product.reviews.length;

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
            <Link to={`/categories/${product.category.toLowerCase()}`} className="text-gray-500 hover:text-tommyfx-blue">
              {product.category}
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
                <img
                  src={product.images[activeImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="grid grid-cols-4 gap-3">
                {product.images.map((image: string, index: number) => (
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
                {product.category}
              </span>
              <h1 className="text-3xl font-bold mt-2 mb-4">{product.name}</h1>
              
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
                  {product.reviews.length} reviews
                </span>
              </div>
              
              <p className="text-2xl font-bold mb-6">${product.price.toFixed(2)}</p>
              
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
                  <Button variant="outline" className="btn-outline flex items-center justify-center">
                    <Heart size={18} className="mr-2" /> Add to Wishlist
                  </Button>
                </div>
                
                <Button variant="ghost" className="mt-3 text-gray-600">
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
                Reviews ({product.reviews.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="details" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">Product Details</h3>
                <p className="mb-4">{product.description}</p>
                <h4 className="text-lg font-medium mb-3">Benefits</h4>
                <ul className="list-disc pl-5 space-y-2">
                  {product.details.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            </TabsContent>
            
            <TabsContent value="ingredients" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">Ingredients</h3>
                <p>{product.details.ingredients}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="howToUse" className="animate-fade-in">
              <div className="prose max-w-none">
                <h3 className="text-xl font-medium mb-4">How to Use</h3>
                <p>{product.details.howToUse}</p>
              </div>
            </TabsContent>
            
            <TabsContent value="reviews" className="animate-fade-in">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-medium">Customer Reviews</h3>
                  <Button variant="outline">Write a Review</Button>
                </div>
                
                <div className="space-y-6">
                  {product.reviews.map((review: any, index: number) => (
                    <div key={index} className="border-b pb-6">
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
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6">You May Also Like</h2>
          
          <div className="product-grid">
            {relatedProducts.map(product => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                image={product.image}
                category={product.category}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductDetail;
