import React, { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import ProductCard from '@/components/ui/ProductCard';
import { Product } from '@/types';

const PAGE_SIZE = 12;

const Categories: React.FC = () => {
  const [categories, setCategories] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<string>('All Products');
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingCats, setLoadingCats] = useState(true);
  const [loadingProds, setLoadingProds] = useState(true);

  // Fetch distinct, non-null categories
  useEffect(() => {
    (async () => {
      setLoadingCats(true);
      try {
        const { data: catRows, error: catErr } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
        if (catErr) throw catErr;

        const cats = Array.from(
          new Set(catRows.map((r: any) => r.category as string))
        );
        setCategories(cats.sort());
      } catch (e) {
        console.error('Error loading categories', e);
      } finally {
        setLoadingCats(false);
      }
    })();
  }, []);

  // Fetch products for the active tab
  useEffect(() => {
    (async () => {
      setLoadingProds(true);
      try {
        let query = supabase
          .from('products')
          .select('id, name, price, discount_percent, image_url, category')
          .order('created_at', { ascending: false })
          .limit(PAGE_SIZE);

        if (activeTab !== 'All Products') {
          query = query.eq('category', activeTab);
        }

        const { data: prodRows, error: prodErr } = await query;
        if (prodErr) throw prodErr;

        setProducts(prodRows as Product[]);
      } catch (e) {
        console.error('Error loading products', e);
      } finally {
        setLoadingProds(false);
      }
    })();
  }, [activeTab]);

  return (
    <div className="bg-white py-16">
      <div className="container-custom">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-serif font-bold mb-2">Our Products</h2>
          <p className="text-gray-600">
            Browse by category or see all of our latest arrivals.
          </p>
        </div>

        {/* Mobile Responsive Tabs - Fixed */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          {loadingCats ? (
            <div className="flex justify-center">
              <Skeleton className="h-10 w-64 rounded-full" />
            </div>
          ) : (
            <div className="flex justify-center pb-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="bg-gray-100 rounded-full p-1 inline-flex min-w-max">
                  <TabsTrigger 
                    value="All Products" 
                    className="rounded-full px-3 sm:px-4 text-sm whitespace-nowrap shrink-0"
                  >
                    All Products
                  </TabsTrigger>
                  {categories.map(cat => (
                    <TabsTrigger 
                      key={cat} 
                      value={cat} 
                      className="rounded-full px-3 sm:px-4 text-sm whitespace-nowrap shrink-0"
                    >
                      {cat}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>
          )}
        </div>

        {/* Products Grid */}
        {loadingProds ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {Array.from({ length: PAGE_SIZE }).map((_, i) => (
              <Skeleton key={i} className="h-80 w-full rounded-xl" />
            ))}
          </div>
        ) : products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(prod => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                name={prod.name}
                price={prod.discount_percent != null ? Math.round(prod.price * (1 - prod.discount_percent / 100)) : prod.price}
                image={prod.image_url}
                category={prod.category}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No products found in "{activeTab}."
          </p>
        )}
      </div>
    </div>
  );
};

export default Categories;