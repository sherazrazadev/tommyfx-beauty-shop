
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import CategoryCard from '@/components/ui/CategoryCard';
import { Skeleton } from '@/components/ui/skeleton';

const Categories = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsCount, setProductsCount] = useState<Record<string, number>>({});
  
  useEffect(() => {
    const fetchCategories = async () => {
      setLoading(true);
      try {
        console.log("Fetching product categories...");
        const { data, error } = await supabase
          .from('products')
          .select('category');
          
        if (error) {
          console.error("Error fetching categories:", error);
          throw error;
        }
        
        // Extract unique categories and count products
        const categoryMap: Record<string, number> = {};
        data?.forEach(product => {
          const category = product.category || 'Uncategorized';
          categoryMap[category] = (categoryMap[category] || 0) + 1;
        });
        
        setCategories(Object.keys(categoryMap).sort());
        setProductsCount(categoryMap);
        console.log("Categories fetched:", Object.keys(categoryMap).length);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <div className="container-custom py-12">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-serif font-bold mb-3">Product Categories</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Explore our wide range of beauty products, categorized for your convenience. Each category offers carefully selected products to meet your beauty needs.
        </p>
      </div>
      
      {/* Categories Grid with loading state */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {loading ? (
          // Loading skeletons
          Array.from({ length: 6 }).map((_, index) => (
            <Skeleton key={index} className="h-64 w-full rounded-lg" />
          ))
        ) : categories.length > 0 ? (
          // Render categories
          categories.map((category) => (
            <Link key={category} to={`/categories/${category.toLowerCase()}`}>
              <CategoryCard 
                name={category} 
                count={productsCount[category] || 0} 
                image={getCategoryImage(category)}
              />
            </Link>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">No categories found. Please check back later.</p>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper function to get appropriate image for each category
function getCategoryImage(category: string): string {
  const imageMap: Record<string, string> = {
    Skincare: 'https://source.unsplash.com/vltMzn0jqsA',
    Makeup: 'https://source.unsplash.com/UKWFNya-YHk',
    Hair: 'https://source.unsplash.com/eeAZHchRdgA',
    Body: 'https://source.unsplash.com/MhOcP0qEZLw',
    Bath: 'https://source.unsplash.com/ql3OpWIeYVw',
    Fragrance: 'https://source.unsplash.com/KLfD2eUNGEY'
  };
  
  return imageMap[category] || 'https://source.unsplash.com/oG8PIWBc3nE';
}

export default Categories;
