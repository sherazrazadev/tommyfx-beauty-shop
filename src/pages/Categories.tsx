
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';

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
    <div className="bg-gradient-to-b from-gray-50 to-white">
      <div className="container-custom py-16">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4 text-gray-900">Our Collections</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our carefully curated categories of premium beauty products, designed to enhance your natural beauty.
          </p>
        </div>
        
        {/* Categories Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <Skeleton key={index} className="h-72 w-full rounded-xl" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link to={`/category/${category}`} key={category} className="group">
                <div className="relative overflow-hidden rounded-xl shadow-lg transition-all duration-300 hover:shadow-xl bg-white h-full">
                  {/* Image */}
                  <div className="h-52 overflow-hidden">
                    <img 
                      src={getCategoryImage(category)}
                      alt={category}
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  
                  {/* Content */}
                  <div className="p-6">
                    <div className="flex justify-between items-center mb-2">
                      <h2 className="text-xl font-bold text-gray-800">{category}</h2>
                      <Badge variant="outline" className="bg-gray-50">
                        {productsCount[category]} products
                      </Badge>
                    </div>
                    
                    <p className="text-gray-600 mb-4">
                      {getCategoryDescription(category)}
                    </p>
                    
                    <div className="flex items-center text-tommyfx-blue font-medium">
                      <span>Shop now</span>
                      <ArrowRight size={16} className="ml-2 transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-gray-500">No categories found. Please check back later.</p>
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

// Helper function to get category descriptions
function getCategoryDescription(category: string): string {
  const descriptionMap: Record<string, string> = {
    Skincare: 'Premium skincare products to nourish and revitalize your skin for a radiant complexion.',
    Makeup: 'High-quality makeup products to enhance your natural beauty and express your unique style.',
    Hair: 'Professional hair care products for healthy, shiny, and manageable hair every day.',
    Body: 'Luxury body care products to pamper your skin and indulge your senses.',
    Bath: 'Relaxing bath products to transform your routine into a spa-like experience.',
    Fragrance: 'Captivating fragrances to complement your personality and leave a lasting impression.'
  };
  
  return descriptionMap[category] || 'Discover our selection of premium products in this category.';
}

export default Categories;
