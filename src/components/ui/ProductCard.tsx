import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '@/hooks/useCart';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { formatCurrency } from '@/lib/utils'; // Import the utility function

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  image: string;
  category?: string;
  originalPrice?: number;
  discountPercent?: number;
}

const ProductCard: React.FC<ProductCardProps> = ({
  id,
  name,
  price,
  image,
  category,
  originalPrice,
  discountPercent
}) => {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      image,
      quantity: 1
    });
    
    // Show success toast when item is added to cart
    toast({
      title: "Added to cart",
      description: `${name} has been added to your cart.`,
      variant: "default",
      duration: 3000,
    });
  };

  // Calculate discount percentage if not provided
  const hasDiscount = originalPrice && originalPrice > price;
  const calculatedDiscountPercent = hasDiscount && !discountPercent
    ? Math.round(((originalPrice - price) / originalPrice) * 100)
    : discountPercent;

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden transition-shadow hover:shadow-md">
      {/* Product Image with Discount Badge */}
      <div className="relative">
        <Link to={`/product/${id}`}>
          <div className="aspect-square overflow-hidden">
            <img 
              src={image} 
              alt={name} 
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
              onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                e.currentTarget.src = 'https://source.unsplash.com/oG8PIWBc3nE';
              }}
            />
          </div>
        </Link>
        
        {hasDiscount && calculatedDiscountPercent && (
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            -{calculatedDiscountPercent}%
          </Badge>
        )}

        {category && (
          <div className="absolute bottom-2 left-2">
            <Badge variant="outline" className="bg-white bg-opacity-80">
              {category}
            </Badge>
          </div>
        )}
      </div>
      
      {/* Product Information */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="font-medium text-gray-800 hover:text-tommyfx-blue mb-2 line-clamp-2">{name}</h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <div className="flex flex-col">
            <span className="font-bold text-gray-900">{formatCurrency(price)}</span>
            {hasDiscount && (
              <span className="text-sm text-gray-500 line-through">
                {formatCurrency(originalPrice || 0)}
              </span>
            )}
          </div>
          
          {/* <button 
            onClick={handleAddToCart}
            className="bg-tommyfx-blue text-white text-sm py-1 px-3 rounded-full hover:bg-blue-600 transition-colors"
          >
            Add to Cart
          </button> */}
        </div>
      </div>
    </div>
  );
};

export default ProductCard;