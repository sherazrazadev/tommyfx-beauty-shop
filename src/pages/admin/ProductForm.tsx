import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Product } from '@/types/index'; // Import the Product type

// Define categories for the dropdown
const categories = [
  'Skincare', 
  'Makeup', 
  'Hair', 
  'Body', 
  'Bath', 
  'Fragrance'
];

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = Boolean(id);
  
  // Form state
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [additionalImages, setAdditionalImages] = useState<string[]>([]);
  const [stock, setStock] = useState('');
  const [discount, setDiscount] = useState('');
  const [originalPrice, setOriginalPrice] = useState('');
  
  // New fields for product details
  const [ingredients, setIngredients] = useState('');
  const [howToUse, setHowToUse] = useState('');
  const [benefits, setBenefits] = useState('');
  
  // UI state
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('basic');

  // Calculate discounted price
  const calculateDiscountedPrice = (original: string, discountPercent: string) => {
    const originalValue = parseFloat(original);
    const discountValue = parseFloat(discountPercent);
    
    if (isNaN(originalValue) || isNaN(discountValue) || discountValue <= 0 || discountValue >= 100) {
      return originalValue;
    }
    
    return originalValue * (1 - discountValue / 100);
  };

  useEffect(() => {
    // Update price based on original price and discount
    if (originalPrice && discount) {
      const discountedPrice = calculateDiscountedPrice(originalPrice, discount);
      setPrice(discountedPrice.toFixed(2));
    } else if (originalPrice) {
      setPrice(originalPrice);
    }
  }, [originalPrice, discount]);

  useEffect(() => {
    // Fetch product data if in edit mode
    if (isEditing) {
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
            // Cast data to our Product type
            const productData = data as Product;
            
            setName(productData.name);
            setDescription(productData.description || '');
            setPrice(productData.price.toString());
            setCategory(productData.category || '');
            setImageUrl(productData.image_url || '');
            
            // Handle additional images if present
            if (productData.additional_images && Array.isArray(productData.additional_images)) {
              setAdditionalImages(productData.additional_images);
            }
            
            setStock(productData.stock?.toString() || '0');
            
            // Handle discount data if available
            if (productData.original_price) {
              setOriginalPrice(productData.original_price.toString());
              if (productData.discount_percent) {
                setDiscount(productData.discount_percent.toString());
              }
            } else {
              setOriginalPrice(productData.price.toString());
            }
            
            // Set the new product detail fields if they exist
            setIngredients(productData.ingredients || '');
            setHowToUse(productData.how_to_use || '');
            
            // Format benefits array to string for textarea (each benefit on a new line)
            if (productData.benefits && Array.isArray(productData.benefits)) {
              setBenefits(productData.benefits.join('\n'));
            }
          }
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            title: "Error",
            description: "Failed to load product details",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchProduct();
    }
  }, [id, isEditing]);

  const handleAddImage = () => {
    if (imageUrl.trim() && !additionalImages.includes(imageUrl.trim())) {
      setAdditionalImages([...additionalImages, imageUrl.trim()]);
      setImageUrl('');
      
      toast({
        title: "Image Added",
        description: "The image has been added to the product gallery",
      });
    } else if (additionalImages.includes(imageUrl.trim())) {
      toast({
        title: "Image Already Exists",
        description: "This image URL is already in the gallery",
        variant: "destructive"
      });
    }
  };
  
  const handleRemoveImage = (index: number) => {
    const newImages = [...additionalImages];
    newImages.splice(index, 1);
    setAdditionalImages(newImages);
    
    toast({
      title: "Image Removed",
      description: "The image has been removed from the gallery",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price) {
      toast({
        title: "Validation Error",
        description: "Product name and price are required",
        variant: "destructive"
      });
      return;
    }
    
    const numericPrice = parseFloat(price);
    if (isNaN(numericPrice) || numericPrice <= 0) {
      toast({
        title: "Invalid Price",
        description: "Please enter a valid price greater than 0",
        variant: "destructive"
      });
      return;
    }
    
    const stockValue = stock ? parseInt(stock) : 0;
    if (isNaN(stockValue) || stockValue < 0) {
      toast({
        title: "Invalid Stock",
        description: "Stock must be a non-negative number",
        variant: "destructive"
      });
      return;
    }
    
    setSaving(true);
    
    // Convert benefits from string to array if it's not empty
    const benefitsArray = benefits.trim() ? benefits.split('\n').filter(benefit => benefit.trim()) : [];
    
    // Prepare product data for database
    const productData = {
      name,
      price: numericPrice,
      description,
      category,
      image_url: imageUrl || (additionalImages.length > 0 ? additionalImages[0] : null),
      additional_images: additionalImages,
      stock: stockValue,
      updated_at: new Date().toISOString(),
      original_price: originalPrice ? parseFloat(originalPrice) : numericPrice,
      discount_percent: discount ? parseFloat(discount) : null,
      // Add the new fields
      ingredients,
      how_to_use: howToUse,
      benefits: benefitsArray
    };
    
    try {
      let result;
      
      if (isEditing) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert([productData]);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: isEditing ? "Product Updated" : "Product Created",
        description: `${name} has been ${isEditing ? 'updated' : 'added'} successfully.`,
      });
      
      // Navigate back to products list
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">
            {isEditing ? 'Edit Product' : 'Add New Product'}
          </h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/admin/products" className="hover:text-tommyfx-blue">Products</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>{isEditing ? 'Edit' : 'New'}</span>
          </div>
        </div>

        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/products')}
          className="mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to Products
        </Button>
        
        {loading ? (
          <div className="space-y-6">
            <Skeleton className="h-10 w-full max-w-md" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-10 w-48" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
              <TabsList>
                <TabsTrigger value="basic">Basic Information</TabsTrigger>
                <TabsTrigger value="details">Product Details</TabsTrigger>
                <TabsTrigger value="images">Product Images</TabsTrigger>
              </TabsList>
              
              <TabsContent value="basic" className="space-y-6 pt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Product Name */}
                  <div className="space-y-2">
                    <Label htmlFor="name">Product Name *</Label>
                    <Input 
                      id="name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter product name"
                      required
                    />
                  </div>
                  
                  {/* Stock */}
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input 
                      id="stock" 
                      type="number" 
                      min="0"
                      value={stock} 
                      onChange={(e) => setStock(e.target.value)}
                      placeholder="0"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Original Price */}
                  <div className="space-y-2">
                    <Label htmlFor="original_price">Original Price (USD) *</Label>
                    <Input 
                      id="original_price" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={originalPrice} 
                      onChange={(e) => setOriginalPrice(e.target.value)}
                      placeholder="0.00"
                      required
                    />
                  </div>
                  
                  {/* Discount */}
                  <div className="space-y-2">
                    <Label htmlFor="discount">Discount (%)</Label>
                    <Input 
                      id="discount" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      max="99.99"
                      value={discount} 
                      onChange={(e) => setDiscount(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  
                  {/* Final Price */}
                  <div className="space-y-2">
                    <Label htmlFor="price">Final Price (USD) *</Label>
                    <Input 
                      id="price" 
                      type="number" 
                      step="0.01" 
                      min="0"
                      value={price} 
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                      required
                      disabled={originalPrice && discount ? true : false}
                    />
                    {originalPrice && discount && (
                      <p className="text-sm text-gray-500">Auto-calculated from discount</p>
                    )}
                  </div>
                </div>
                
                {/* Category */}
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger id="category">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Description */}
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={description} 
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Product description"
                    rows={5}
                  />
                </div>
              </TabsContent>
              
              <TabsContent value="details" className="space-y-6 pt-4">
                {/* Ingredients */}
                <div className="space-y-2">
                  <Label htmlFor="ingredients">Ingredients</Label>
                  <Textarea 
                    id="ingredients" 
                    value={ingredients} 
                    onChange={(e) => setIngredients(e.target.value)}
                    placeholder="List of ingredients separated by commas"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Enter all ingredients separated by commas
                  </p>
                </div>
                
                {/* How to Use */}
                <div className="space-y-2">
                  <Label htmlFor="howToUse">How to Use</Label>
                  <Textarea 
                    id="howToUse" 
                    value={howToUse} 
                    onChange={(e) => setHowToUse(e.target.value)}
                    placeholder="Instructions on how to use the product"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Provide clear instructions for product usage
                  </p>
                </div>
                
                {/* Benefits */}
                <div className="space-y-2">
                  <Label htmlFor="benefits">Product Benefits</Label>
                  <Textarea 
                    id="benefits" 
                    value={benefits} 
                    onChange={(e) => setBenefits(e.target.value)}
                    placeholder="Enter each benefit on a new line"
                    rows={4}
                  />
                  <p className="text-sm text-gray-500">
                    Enter each benefit on a new line. These will be displayed as bullet points.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="images" className="space-y-6 pt-4">
                {/* Primary Image URL */}
                <div className="space-y-2">
                  <Label htmlFor="image_url">Image URL</Label>
                  <div className="flex space-x-2">
                    <Input 
                      id="image_url" 
                      value={imageUrl} 
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      onClick={handleAddImage}
                      disabled={!imageUrl.trim()}
                    >
                      <Plus size={16} className="mr-2" /> Add to Gallery
                    </Button>
                  </div>
                  <p className="text-sm text-gray-500">Add multiple images to the product gallery.</p>
                </div>
                
                {/* Image Gallery */}
                {(additionalImages.length > 0 || imageUrl) && (
                  <div className="space-y-2">
                    <Label className="block mb-2">Image Gallery</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {imageUrl && (
                        <div className="relative aspect-square rounded border border-gray-200 overflow-hidden">
                          <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.src = 'https://source.unsplash.com/oG8PIWBc3nE';
                            }}
                          />
                          <div className="absolute top-0 left-0 w-full p-2 bg-gray-900 bg-opacity-50 text-white text-xs">
                            Current
                          </div>
                        </div>
                      )}
                      
                      {additionalImages.map((img, index) => (
                        <div key={index} className="relative aspect-square rounded border border-gray-200 overflow-hidden group">
                          <img 
                            src={img} 
                            alt={`Product ${index + 1}`} 
                            className="w-full h-full object-cover"
                            onError={(e: React.SyntheticEvent<HTMLImageElement>) => {
                              e.currentTarget.src = 'https://source.unsplash.com/oG8PIWBc3nE';
                            }}
                          />
                          <button 
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="absolute top-2 right-2 bg-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X size={16} className="text-red-500" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </TabsContent>
            </Tabs>
            
            <div className="pt-4 border-t mt-6">
              <Button 
                type="submit" 
                disabled={saving}
                className="mr-2"
              >
                {saving ? 'Saving...' : isEditing ? 'Update Product' : 'Save Product'}
              </Button>
              
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => navigate('/admin/products')}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>
    </AdminLayout>
  );
};

export default ProductForm;