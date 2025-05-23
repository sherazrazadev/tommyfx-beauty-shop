import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/components/wishlist/useWishlist';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/components/ui/use-toast';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  originalPrice?: number;
  discountPercent?: number;
  stock?: number; // Add stock prop
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  originalPrice,
  discountPercent,
  stock = 0 // Default to 0 if not provided
}) => {
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Stock status helper functions
  const getStockStatus = (stock: number) => {
    if (stock === 0) return { label: 'Out of Stock', color: 'bg-red-100 text-red-800' };
    if (stock <= 3) return { label: `Only ${stock} left`, color: 'bg-orange-100 text-orange-800' };
    if (stock <= 10) return { label: `${stock} in stock`, color: 'bg-yellow-100 text-yellow-800' };
    return { label: 'In Stock', color: 'bg-green-100 text-green-800' };
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (stock === 0) {
      toast({
        title: "Out of Stock",
        description: "This product is currently unavailable",
        variant: "destructive"
      });
      return;
    }

    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1
    });

    toast({
      title: "Added to cart",
      description: `${name} added to your cart`,
      duration: 2000
    });
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isInWishlist(id)) {
      removeFromWishlist(id);
      toast({
        title: "Removed from wishlist",
        description: `${name} removed from wishlist`,
        duration: 2000
      });
    } else {
      addToWishlist({ id, name, price, image });
      toast({
        title: "Added to wishlist",
        description: `${name} added to wishlist`,
        duration: 2000
      });
    }
  };

  const stockInfo = getStockStatus(stock);
  const discountPrice = discountPercent ? price * (1 - discountPercent / 100) : null;
  const finalPrice = discountPrice || price;

  return (
    <Link to={`/product/${id}`}>
      <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300 h-full">
        <div className="relative aspect-square overflow-hidden">
          {/* Discount Badge */}
          {discountPercent && (
            <Badge className="absolute top-2 left-2 z-10 bg-red-500 hover:bg-red-600">
              -{Math.round(discountPercent)}%
            </Badge>
          )}
          
          {/* Stock Badge */}
          <Badge 
            className={`absolute top-2 right-2 z-10 text-xs ${stockInfo.color}`}
            variant="secondary"
          >
            <Package size={12} className="mr-1" />
            {stockInfo.label}
          </Badge>

          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className={`absolute top-2 left-1/2 transform -translate-x-1/2 p-2 rounded-full transition-all duration-200 z-10 ${
              isInWishlist(id) 
                ? 'bg-red-500 text-white' 
                : 'bg-white/80 hover:bg-white text-gray-600 hover:text-red-500'
            }`}
          >
            <Heart 
              size={16} 
              className={isInWishlist(id) ? 'fill-current' : ''} 
            />
          </button>

          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
              e.currentTarget.src = 'https://source.unsplash.com/oG8PIWBc3nE';
            }}
          />
        </div>

        <CardContent className="p-4">
          <div className="mb-2">
            {category && (
              <span className="text-xs text-gray-500 uppercase tracking-wide">
                {category}
              </span>
            )}
            <h3 className="font-medium text-gray-900 line-clamp-2 group-hover:text-tommyfx-blue transition-colors">
              {name}
            </h3>
          </div>

          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg text-tommyfx-blue">
                  {formatCurrency(finalPrice)}
                </span>
                {discountPrice && originalPrice && (
                  <span className="text-sm text-gray-500 line-through">
                    {formatCurrency(originalPrice)}
                  </span>
                )}
              </div>
            </div>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={stock === 0}
            className={`w-full transition-colors ${
              stock === 0 
                ? 'bg-gray-300 cursor-not-allowed' 
                : 'bg-tommyfx-blue hover:bg-blue-600'
            }`}
            size="sm"
          >
            {stock === 0 ? (
              'Out of Stock'
            ) : (
              <>
                <ShoppingCart size={16} className="mr-2" />
                Add to Cart
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;