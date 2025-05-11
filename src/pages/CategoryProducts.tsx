
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { ChevronRight } from 'lucide-react';

const CategoryProducts = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [categoryName, setCategoryName] = useState(categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1) : '');
  
  useEffect(() => {
    const fetchProductsByCategory = async () => {
      setLoading(true);
      try {
        console.log(`Fetching products for category: ${categoryId}`);
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .ilike('category', `%${categoryId}%`);
          
        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
        
        console.log(`Products fetched for ${categoryId}:`, data?.length || 0);
        setProducts(data || []);

        // If we have products, use the first product's category name for display
        if (data && data.length > 0 && data[0].category) {
          setCategoryName(data[0].category);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    
    if (categoryId) {
      fetchProductsByCategory();
    }
  }, [categoryId]);
  
  return (
    <div className="container-custom py-12">
      {/* Breadcrumbs */}
      <div className="flex items-center text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-tommyfx-blue">Home</Link>
        <ChevronRight size={16} className="mx-2" />
        <Link to="/categories" className="hover:text-tommyfx-blue">Categories</Link>
        <ChevronRight size={16} className="mx-2" />
        <span className="text-gray-700">{categoryName}</span>
      </div>
      
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">{categoryName}</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our selection of {categoryName.toLowerCase()} products crafted for your beauty needs.
        </p>
      </div>
      
      {/* Products Grid with loading state */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="animate-pulse">
              <Skeleton className="h-64 w-full rounded-lg mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
          ))
        ) : products.length > 0 ? (
          // Render products
          products.map((product) => (
            <ProductCard 
              key={product.id}
              id={product.id}
              name={product.name}
              price={parseFloat(product.price)}
              image={product.image_url || 'https://source.unsplash.com/oG8PIWBc3nE'}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No products found in this category. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryProducts;
