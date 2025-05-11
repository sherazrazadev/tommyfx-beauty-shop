
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Trash2, 
  ShoppingCart,
  ChevronRight,
  Heart
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useWishlist } from '@/components/wishlist/useWishlist';
import { useCart } from '@/hooks/useCart';

const WishlistPage = () => {
  const { wishlist, removeFromWishlist, clearWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleAddToCart = (item: any) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      quantity: 1
    });
    
    toast({
      title: "Added to cart",
      description: `${item.name} has been added to your cart`,
    });
  };
  
  const handleRemoveItem = (id: string) => {
    removeFromWishlist(id);
  };
  
  return (
    <div className="container-custom py-10">
      {/* Breadcrumb */}
      <div className="flex items-center text-sm mb-8">
        <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
        <ChevronRight size={16} className="mx-2 text-gray-400" />
        <span className="text-gray-800">My Wishlist</span>
      </div>
      
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Wishlist</h1>
        
        {wishlist.length > 0 && (
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => clearWishlist()}
          >
            Clear Wishlist
          </Button>
        )}
      </div>
      
      {wishlist.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((item) => (
            <Card key={item.id} className="overflow-hidden">
              <div className="aspect-square relative">
                <Link to={`/product/${item.id}`}>
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                    onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                      e.currentTarget.src = 'https://source.unsplash.com/oG8PIWBc3nE';
                    }}
                  />
                </Link>
                <Button
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2 rounded-full w-8 h-8 p-0"
                  onClick={() => handleRemoveItem(item.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <Link to={`/product/${item.id}`}>
                  <h3 className="font-medium text-lg hover:text-tommyfx-blue mb-1">{item.name}</h3>
                </Link>
                <p className="text-lg font-bold mb-3">${item.price.toFixed(2)}</p>
                
                <Button 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={() => handleAddToCart(item)}
                >
                  <ShoppingCart size={16} />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-gray-50 rounded-lg">
          <Heart className="mx-auto h-16 w-16 text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your wishlist is empty</h2>
          <p className="text-gray-600 mb-6">Add products you love to your wishlist</p>
          <Link to="/categories">
            <Button>Browse Products</Button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
