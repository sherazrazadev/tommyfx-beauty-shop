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
  // In Categories.tsx - update the useEffect for fetching products
  useEffect(() => {
    (async () => {
      setLoadingProds(true);
      try {
        let query = supabase
          .from('products')
          .select('*') // Select all fields instead of specific ones
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

        {/* Mobile Responsive Tabs - Fixed Left Cutoff */}
        <div className="mb-8">
          {loadingCats ? (
            <div className="flex justify-center">
              <Skeleton className="h-10 w-64 rounded-full" />
            </div>
          ) : (
            <div className="w-full overflow-x-auto scrollbar-hide px-4">
              <div className="flex justify-start md:justify-center pb-2">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-gray-100 rounded-full p-1 inline-flex">
                    <TabsTrigger 
                      value="All Products" 
                      className="rounded-full px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap shrink-0"
                    >
                      All
                    </TabsTrigger>
                    {categories.map(cat => (
                      <TabsTrigger 
                        key={cat} 
                        value={cat} 
                        className="rounded-full px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap shrink-0"
                      >
                        {cat}
                      </TabsTrigger>
                    ))}
                  </TabsList>
                </Tabs>
              </div>
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
                stock={prod.stock || 0} // Add this line

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

// import React, { useState, useEffect } from 'react';
// import { supabase } from '@/integrations/supabase/client';
// import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
// import { Skeleton } from '@/components/ui/skeleton';
// import ProductCard from '@/components/ui/ProductCard';
// import { Product } from '@/types';
// import { Button } from '@/components/ui/button';
// import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
// import { Slider } from '@/components/ui/slider';
// import { Checkbox } from '@/components/ui/checkbox';
// import { Badge } from '@/components/ui/badge';
// import { Filter, X, SlidersHorizontal } from 'lucide-react';

// const PAGE_SIZE = 12;

// interface Filters {
//   priceRange: [number, number];
//   skinTypes: string[];
//   categories: string[];
//   inStock: boolean;
//   onSale: boolean;
// }

// const Categories: React.FC = () => {
//   const [categories, setCategories] = useState<string[]>([]);
//   const [activeTab, setActiveTab] = useState<string>('All Products');
//   const [products, setProducts] = useState<Product[]>([]);
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
//   const [loadingCats, setLoadingCats] = useState(true);
//   const [loadingProds, setLoadingProds] = useState(true);
//   const [showFilters, setShowFilters] = useState(false);
  
//   // Filter states
//   const [filters, setFilters] = useState<Filters>({
//     priceRange: [0, 5000],
//     skinTypes: [],
//     categories: [],
//     inStock: false,
//     onSale: false
//   });

//   // Skin type options
//   const skinTypeOptions = [
//     'Oily Skin',
//     'Dry Skin', 
//     'Combination Skin',
//     'Sensitive Skin',
//     'Normal Skin',
//     'Acne-Prone',
//     'Mature Skin'
//   ];

//   // Fetch categories
//   useEffect(() => {
//     (async () => {
//       setLoadingCats(true);
//       try {
//         const { data: catRows, error: catErr } = await supabase
//           .from('products')
//           .select('category')
//           .not('category', 'is', null);
//         if (catErr) throw catErr;

//         const cats = Array.from(
//           new Set(catRows.map((r: any) => r.category as string))
//         );
//         setCategories(cats.sort());
//       } catch (e) {
//         console.error('Error loading categories', e);
//       } finally {
//         setLoadingCats(false);
//       }
//     })();
//   }, []);

//   // Fetch products
//   useEffect(() => {
//     (async () => {
//       setLoadingProds(true);
//       try {
//         let query = supabase
//           .from('products')
//           .select('*')
//           .order('created_at', { ascending: false });

//         if (activeTab !== 'All Products') {
//           query = query.eq('category', activeTab);
//         }

//         const { data: prodRows, error: prodErr } = await query;
//         if (prodErr) throw prodErr;

//         setProducts(prodRows as Product[]);
//       } catch (e) {
//         console.error('Error loading products', e);
//       } finally {
//         setLoadingProds(false);
//       }
//     })();
//   }, [activeTab]);

//   // Apply filters
//   useEffect(() => {
//     let filtered = [...products];

//     // Price filter
//     filtered = filtered.filter(product => {
//       const price = product.discount_percent 
//         ? product.price * (1 - product.discount_percent / 100)
//         : product.price;
//       return price >= filters.priceRange[0] && price <= filters.priceRange[1];
//     });

//     // Stock filter
//     if (filters.inStock) {
//       filtered = filtered.filter(product => (product.stock || 0) > 0);
//     }

//     // On sale filter
//     if (filters.onSale) {
//       filtered = filtered.filter(product => product.discount_percent && product.discount_percent > 0);
//     }

//     // Skin type filter (check product description for skin type mentions)
//     if (filters.skinTypes.length > 0) {
//       filtered = filtered.filter(product => {
//         const description = (product.description || '').toLowerCase();
//         return filters.skinTypes.some(skinType => 
//           description.includes(skinType.toLowerCase())
//         );
//       });
//     }

//     setFilteredProducts(filtered);
//   }, [products, filters]);

//   // Handle filter changes
//   const updateFilter = (key: keyof Filters, value: any) => {
//     setFilters(prev => ({ ...prev, [key]: value }));
//   };

//   const clearFilters = () => {
//     setFilters({
//       priceRange: [0, 5000],
//       skinTypes: [],
//       categories: [],
//       inStock: false,
//       onSale: false
//     });
//   };

//   const activeFiltersCount = 
//     (filters.skinTypes.length > 0 ? 1 : 0) +
//     (filters.inStock ? 1 : 0) +
//     (filters.onSale ? 1 : 0) +
//     (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000 ? 1 : 0);

//   return (
//     <div className="bg-white py-16">
//       <div className="container-custom">
//         {/* Header */}
//         <div className="text-center mb-10">
//           <h2 className="text-4xl font-serif font-bold mb-2">Our Products</h2>
//           <p className="text-gray-600">
//             Browse by category or use filters to find your perfect products.
//           </p>
//         </div>

//         {/* Mobile Filter Button */}
//         <div className="mb-6 lg:hidden">
//           <Button
//             onClick={() => setShowFilters(!showFilters)}
//             variant="outline"
//             className="w-full flex items-center justify-center gap-2"
//           >
//             <SlidersHorizontal size={16} />
//             Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
//           </Button>
//         </div>

//         <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
//           {/* Filters Sidebar */}
//           <div className={`lg:col-span-1 ${showFilters ? 'block' : 'hidden lg:block'}`}>
//             <Card className="sticky top-4">
//               <CardHeader>
//                 <CardTitle className="flex items-center justify-between">
//                   <span className="flex items-center gap-2">
//                     <Filter size={18} />
//                     Filters
//                   </span>
//                   {activeFiltersCount > 0 && (
//                     <Button
//                       onClick={clearFilters}
//                       variant="ghost"
//                       size="sm"
//                       className="text-red-500 hover:text-red-700"
//                     >
//                       Clear All
//                     </Button>
//                   )}
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-6">
//                 {/* Price Range */}
//                 <div>
//                   <h4 className="font-medium mb-3">Price Range</h4>
//                   <Slider
//                     value={filters.priceRange}
//                     onValueChange={(value) => updateFilter('priceRange', value)}
//                     max={5000}
//                     min={0}
//                     step={100}
//                     className="mb-2"
//                   />
//                   <div className="flex justify-between text-sm text-gray-500">
//                     <span>Rs. {filters.priceRange[0]}</span>
//                     <span>Rs. {filters.priceRange[1]}</span>
//                   </div>
//                 </div>

//                 {/* Skin Type */}
//                 <div>
//                   <h4 className="font-medium mb-3">Skin Type</h4>
//                   <div className="space-y-2">
//                     {skinTypeOptions.map(skinType => (
//                       <div key={skinType} className="flex items-center space-x-2">
//                         <Checkbox
//                           id={skinType}
//                           checked={filters.skinTypes.includes(skinType)}
//                           onCheckedChange={(checked) => {
//                             if (checked) {
//                               updateFilter('skinTypes', [...filters.skinTypes, skinType]);
//                             } else {
//                               updateFilter('skinTypes', filters.skinTypes.filter(t => t !== skinType));
//                             }
//                           }}
//                         />
//                         <label
//                           htmlFor={skinType}
//                           className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
//                         >
//                           {skinType}
//                         </label>
//                       </div>
//                     ))}
//                   </div>
//                 </div>

//                 {/* Availability */}
//                 <div>
//                   <h4 className="font-medium mb-3">Availability</h4>
//                   <div className="space-y-2">
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="inStock"
//                         checked={filters.inStock}
//                         onCheckedChange={(checked) => updateFilter('inStock', checked)}
//                       />
//                       <label htmlFor="inStock" className="text-sm cursor-pointer">
//                         In Stock Only
//                       </label>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                       <Checkbox
//                         id="onSale"
//                         checked={filters.onSale}
//                         onCheckedChange={(checked) => updateFilter('onSale', checked)}
//                       />
//                       <label htmlFor="onSale" className="text-sm cursor-pointer">
//                         On Sale
//                       </label>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Active Filters */}
//                 {activeFiltersCount > 0 && (
//                   <div>
//                     <h4 className="font-medium mb-3">Active Filters</h4>
//                     <div className="flex flex-wrap gap-2">
//                       {filters.skinTypes.map(skinType => (
//                         <Badge key={skinType} variant="secondary" className="flex items-center gap-1">
//                           {skinType}
//                           <X
//                             size={12}
//                             className="cursor-pointer"
//                             onClick={() => updateFilter('skinTypes', filters.skinTypes.filter(t => t !== skinType))}
//                           />
//                         </Badge>
//                       ))}
//                       {filters.inStock && (
//                         <Badge variant="secondary" className="flex items-center gap-1">
//                           In Stock
//                           <X
//                             size={12}
//                             className="cursor-pointer"
//                             onClick={() => updateFilter('inStock', false)}
//                           />
//                         </Badge>
//                       )}
//                       {filters.onSale && (
//                         <Badge variant="secondary" className="flex items-center gap-1">
//                           On Sale
//                           <X
//                             size={12}
//                             className="cursor-pointer"
//                             onClick={() => updateFilter('onSale', false)}
//                           />
//                         </Badge>
//                       )}
//                     </div>
//                   </div>
//                 )}
//               </CardContent>
//             </Card>
//           </div>

//           {/* Products Section */}
//           <div className="lg:col-span-3">
//             {/* Category Tabs */}
//             <div className="mb-8">
//               {loadingCats ? (
//                 <div className="flex justify-center">
//                   <Skeleton className="h-10 w-64 rounded-full" />
//                 </div>
//               ) : (
//                 <div className="w-full overflow-x-auto scrollbar-hide px-4">
//                   <div className="flex justify-start md:justify-center pb-2">
//                     <Tabs value={activeTab} onValueChange={setActiveTab}>
//                       <TabsList className="bg-gray-100 rounded-full p-1 inline-flex">
//                         <TabsTrigger 
//                           value="All Products" 
//                           className="rounded-full px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap shrink-0"
//                         >
//                           All
//                         </TabsTrigger>
//                         {categories.map(cat => (
//                           <TabsTrigger 
//                             key={cat} 
//                             value={cat} 
//                             className="rounded-full px-2 sm:px-3 text-xs sm:text-sm whitespace-nowrap shrink-0"
//                           >
//                             {cat}
//                           </TabsTrigger>
//                         ))}
//                       </TabsList>
//                     </Tabs>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Results Count */}
//             <div className="mb-6 flex items-center justify-between">
//               <p className="text-gray-600">
//                 {loadingProds ? 'Loading...' : `${filteredProducts.length} products found`}
//               </p>
//             </div>

//             {/* Products Grid */}
//             {loadingProds ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {Array.from({ length: PAGE_SIZE }).map((_, i) => (
//                   <Skeleton key={i} className="h-80 w-full rounded-xl" />
//                 ))}
//               </div>
//             ) : filteredProducts.length > 0 ? (
//               <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//                 {filteredProducts.map(prod => (
//                   <ProductCard
//                     key={prod.id}
//                     id={prod.id}
//                     name={prod.name}
//                     price={prod.discount_percent != null ? Math.round(prod.price * (1 - prod.discount_percent / 100)) : prod.price}
//                     image={prod.image_url}
//                     category={prod.category}
//                     stock={prod.stock || 0}
//                     originalPrice={prod.original_price}
//                     discountPercent={prod.discount_percent}
//                   />
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-12">
//                 <p className="text-gray-500 text-lg mb-4">No products match your filters</p>
//                 <Button onClick={clearFilters} variant="outline">
//                   Clear Filters
//                 </Button>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Categories;