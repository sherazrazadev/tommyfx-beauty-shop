
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight, Loader2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/hooks/useAuth';

type ProductFormData = {
  name: string;
  price: string;
  category: string;
  description: string;
  image_url: string;
};

const ProductForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const isEditMode = Boolean(id);
  const [loading, setLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<string[]>([]);
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    price: '',
    category: '',
    description: '',
    image_url: ''
  });

  // Fetch product data if in edit mode
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('category')
          .not('category', 'is', null);
        
        if (error) throw error;
        
        const uniqueCategories = [...new Set(data.map(item => item.category))];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast({
          title: "Error",
          description: "Failed to load categories",
          variant: "destructive"
        });
      }
    };

    fetchCategories();
    
    if (isEditMode) {
      const fetchProductData = async () => {
        setLoading(true);
        try {
          console.log("Fetching product data for ID:", id);
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();
          
          if (error) throw error;
          
          console.log("Product data fetched:", data);
          setFormData({
            name: data.name || '',
            price: data.price ? data.price.toString() : '',
            category: data.category || '',
            description: data.description || '',
            image_url: data.image_url || ''
          });
        } catch (error) {
          console.error('Error fetching product:', error);
          toast({
            title: "Error",
            description: "Failed to load product data",
            variant: "destructive"
          });
        } finally {
          setLoading(false);
        }
      };
      
      fetchProductData();
    }
  }, [id, isEditMode]);

  // Check if user is admin
  useEffect(() => {
    if (!isAdmin && !loading) {
      toast({
        title: "Access Denied",
        description: "You need admin permissions to access this page",
        variant: "destructive"
      });
      navigate('/admin');
    }
  }, [isAdmin, navigate, loading]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    try {
      // Validate form inputs
      if (!formData.name.trim()) {
        throw new Error('Product name is required');
      }
      
      const price = parseFloat(formData.price);
      if (isNaN(price) || price <= 0) {
        throw new Error('Please enter a valid price');
      }
      
      const productData = {
        ...formData,
        price,
        updated_at: new Date()
      };
      
      let result;
      
      if (isEditMode) {
        // Update existing product
        result = await supabase
          .from('products')
          .update(productData)
          .eq('id', id);
      } else {
        // Create new product
        result = await supabase
          .from('products')
          .insert(productData);
      }
      
      if (result.error) throw result.error;
      
      toast({
        title: isEditMode ? "Product Updated" : "Product Created",
        description: `Successfully ${isEditMode ? 'updated' : 'added'} ${formData.name}`,
      });
      
      navigate('/admin/products');
    } catch (error: any) {
      console.error('Error saving product:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to save product",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading product data...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">{isEditMode ? 'Edit Product' : 'Add New Product'}</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <Link to="/admin/products" className="hover:text-tommyfx-blue">Products</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>{isEditMode ? 'Edit' : 'New'}</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Product Details */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Product Name*
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter product name"
                  />
                </div>
                
                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)*
                  </label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="0.01"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                    placeholder="0.00"
                  />
                </div>
                
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <div className="relative">
                    <select
                      id="category"
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                      <option value="other">Other (Custom)</option>
                    </select>
                  </div>
                </div>
                
                {formData.category === 'other' && (
                  <div>
                    <label htmlFor="customCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Custom Category
                    </label>
                    <Input
                      id="customCategory"
                      name="category"
                      value={formData.category === 'other' ? '' : formData.category}
                      onChange={handleInputChange}
                      placeholder="Enter custom category"
                    />
                  </div>
                )}
              </div>
              
              {/* Image and Description */}
              <div className="space-y-4">
                <div>
                  <label htmlFor="image_url" className="block text-sm font-medium text-gray-700 mb-1">
                    Image URL
                  </label>
                  <Input
                    id="image_url"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </div>
                
                {formData.image_url && (
                  <div className="mt-2 border rounded-md p-2">
                    <p className="text-xs text-gray-500 mb-2">Image Preview:</p>
                    <img 
                      src={formData.image_url} 
                      alt="Product preview" 
                      className="w-full h-40 object-cover rounded"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://source.unsplash.com/oG8PIWBc3nE";
                      }}
                    />
                  </div>
                )}
                
                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                    Description
                  </label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={5}
                    placeholder="Enter product description"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex justify-between mt-8 pt-4 border-t">
              <Button 
                type="button" 
                variant="outline"
                onClick={() => navigate('/admin/products')}
                disabled={isSaving}
              >
                <ArrowLeft size={16} className="mr-2" />
                Back to Products
              </Button>
              
              <div className="flex gap-3">
                {isEditMode && (
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="text-red-500 hover:text-red-600"
                    disabled={isSaving}
                    onClick={async () => {
                      if (window.confirm('Are you sure you want to delete this product? This action cannot be undone.')) {
                        try {
                          const { error } = await supabase
                            .from('products')
                            .delete()
                            .eq('id', id);
                          
                          if (error) throw error;
                          
                          toast({
                            title: "Product Deleted",
                            description: `${formData.name} has been deleted`,
                          });
                          
                          navigate('/admin/products');
                        } catch (error: any) {
                          console.error('Error deleting product:', error);
                          toast({
                            title: "Error",
                            description: "Failed to delete product",
                            variant: "destructive"
                          });
                        }
                      }
                    }}
                  >
                    Delete
                  </Button>
                )}
                
                <Button type="submit" disabled={isSaving}>
                  {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving...' : isEditMode ? 'Update Product' : 'Create Product'}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default ProductForm;
