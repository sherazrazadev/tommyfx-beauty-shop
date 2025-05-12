
import React from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';

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
  const hasDiscount = originalPrice && discountPercent && originalPrice > price;

  return (
    <div className="group relative card-shadow rounded-md overflow-hidden bg-white animate-zoom-in">
      {/* Product Image with Hover Effect */}
      <Link to={`/product/${id}`} className="block overflow-hidden">
        <div className="relative aspect-square overflow-hidden">
          <img 
            src={image} 
            alt={name} 
            className="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-105"
          />
          <button className="absolute top-4 right-4 bg-white p-2 rounded-full opacity-75 hover:opacity-100 transition-opacity">
            <Heart size={18} className="text-tommyfx-black" />
          </button>
          
          {category && (
            <span className="absolute top-4 left-4 bg-tommyfx-blue px-2 py-1 text-xs text-white rounded">
              {category}
            </span>
          )}

          {hasDiscount && (
            <span className="absolute bottom-4 left-4 bg-red-500 px-2 py-1 text-xs text-white rounded-full">
              {Math.round(discountPercent)}% OFF
            </span>
          )}
        </div>
      </Link>
      
      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${id}`}>
          <h3 className="text-md font-medium mb-2 line-clamp-2 group-hover:text-tommyfx-blue transition-colors">
            {name}
          </h3>
        </Link>
        
        <div className="flex items-center">
          <p className="text-lg font-medium">${price.toFixed(2)}</p>
          {hasDiscount && (
            <p className="ml-2 text-sm text-gray-500 line-through">${originalPrice.toFixed(2)}</p>
          )}
        </div>
        
        {/* Quick Shop Button that appears on hover */}
        <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Link 
            to={`/product/${id}`}
            className="btn-primary w-full block text-center"
          >
            Quick Shop
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
