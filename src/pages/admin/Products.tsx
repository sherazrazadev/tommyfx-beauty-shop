
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Search, 
  Filter, 
  ArrowDown, 
  ArrowUp, 
  PlusCircle,
  Trash2,
  Edit,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';
import { supabase } from '@/integrations/supabase/client';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from '@/components/ui/use-toast';

type ProductType = {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image_url: string;
  description?: string;
};

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<ProductType[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [categories, setCategories] = useState<string[]>(['All']);
  
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        console.log("Fetching products...");
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) {
          console.error("Error fetching products:", error);
          throw error;
        }
        
        console.log("Products fetched:", data?.length || 0);
        
        // Transform data to match our ProductType
        const transformedProducts: ProductType[] = (data || []).map(product => ({
          id: product.id,
          name: product.name,
          category: product.category || 'Uncategorized',
          price: parseFloat(product.price),
          // Mock stock and status since they're not in the database
          stock: Math.floor(Math.random() * 50) + 1,
          status: Math.random() > 0.2 ? 'Active' : Math.random() > 0.5 ? 'Low Stock' : 'Out of Stock',
          image_url: product.image_url || 'https://source.unsplash.com/oG8PIWBc3nE',
          description: product.description
        }));
        
        // Extract unique categories
        const uniqueCategories = ['All', ...new Set(transformedProducts.map(p => p.category))];
        setCategories(uniqueCategories);
        
        setProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast({
          title: "Error",
          description: "Failed to load products",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);

  const handleDeleteProduct = async (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        const { error } = await supabase
          .from('products')
          .delete()
          .eq('id', id);
        
        if (error) throw error;
        
        toast({
          title: "Product Deleted",
          description: `${name} has been deleted successfully.`
        });
        
        // Update the products list without reloading
        setProducts(products.filter(product => product.id !== id));
      } catch (error) {
        console.error('Error deleting product:', error);
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive"
        });
      }
    }
  };
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (categoryFilter === 'All' || product.category === categoryFilter) &&
      (statusFilter === 'All' || product.status === statusFilter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField as keyof ProductType];
      const bValue = b[sortField as keyof ProductType];
      
      if (typeof aValue === 'string' && typeof bValue === 'string') {
        return sortDirection === 'asc' 
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      } else if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      }
      return 0;
    });
  
  const handleSort = (field: string) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  const renderSortIcon = (field: string) => {
    if (sortField !== field) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp size={14} className="ml-1" /> 
      : <ArrowDown size={14} className="ml-1" />;
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Products Management</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Products</span>
          </div>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products by name..."
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <Filter size={18} className="mr-2 text-gray-500" />
                <select
                  value={categoryFilter}
                  onChange={e => setCategoryFilter(e.target.value)}
                  className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category} Categories</option>
                  ))}
                </select>
              </div>
              
              <div className="flex items-center">
                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                >
                  <option value="All">All Status</option>
                  <option value="Active">Active</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>
              
              <Button asChild className="btn-primary">
                <Link to="/admin/products/new">
                  <PlusCircle size={18} className="mr-2" />
                  Add New Product
                </Link>
              </Button>
            </div>
          </div>
        </div>

        {/* Products Display with loading state */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold">
              Products ({loading ? "..." : filteredProducts.length})
            </h2>
            <div className="flex gap-2">
              <Button 
                variant={view === 'grid' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('grid')}
              >
                Grid
              </Button>
              <Button 
                variant={view === 'list' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setView('list')}
              >
                List
              </Button>
            </div>
          </div>
          
          {loading ? (
            view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                  <Skeleton key={i} className="h-64 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} className="h-16 w-full" />
                ))}
              </div>
            )
          ) : (
            view === 'grid' ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map(product => (
                  <div key={product.id} className="border rounded-lg overflow-hidden">
                    <div className="aspect-square relative">
                      <img 
                        src={product.image_url} 
                        alt={product.name} 
                        className="w-full h-full object-cover" 
                      />
                      <div className={`absolute top-2 right-2 px-2 py-1 text-xs rounded-full ${
                        product.status === 'Active' ? 'bg-green-100 text-green-800' :
                        product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {product.status}
                      </div>
                    </div>
                    
                    <div className="p-4">
                      <h3 className="font-medium mb-1">{product.name}</h3>
                      <p className="text-sm text-gray-500 mb-2">{product.category}</p>
                      <div className="flex justify-between mb-3">
                        <span className="font-medium">${product.price.toFixed(2)}</span>
                        <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="flex-1"
                          onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                        >
                          Edit
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-red-500"
                          onClick={() => handleDeleteProduct(product.id, product.name)}
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left bg-gray-50">
                      <th className="p-3 font-medium">Image</th>
                      <th className="p-3 font-medium">
                        <button 
                          onClick={() => handleSort('name')} 
                          className="flex items-center focus:outline-none"
                        >
                          Product {renderSortIcon('name')}
                        </button>
                      </th>
                      <th className="p-3 font-medium">
                        <button 
                          onClick={() => handleSort('category')} 
                          className="flex items-center focus:outline-none"
                        >
                          Category {renderSortIcon('category')}
                        </button>
                      </th>
                      <th className="p-3 font-medium">
                        <button 
                          onClick={() => handleSort('price')} 
                          className="flex items-center focus:outline-none"
                        >
                          Price {renderSortIcon('price')}
                        </button>
                      </th>
                      <th className="p-3 font-medium">
                        <button 
                          onClick={() => handleSort('stock')} 
                          className="flex items-center focus:outline-none"
                        >
                          Stock {renderSortIcon('stock')}
                        </button>
                      </th>
                      <th className="p-3 font-medium">Status</th>
                      <th className="p-3 font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredProducts.map(product => (
                      <tr key={product.id} className="border-t">
                        <td className="p-3">
                          <div className="w-12 h-12 rounded overflow-hidden">
                            <img 
                              src={product.image_url} 
                              alt={product.name} 
                              className="w-full h-full object-cover" 
                            />
                          </div>
                        </td>
                        <td className="p-3 font-medium">{product.name}</td>
                        <td className="p-3">{product.category}</td>
                        <td className="p-3">${product.price.toFixed(2)}</td>
                        <td className="p-3">{product.stock}</td>
                        <td className="p-3">
                          <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                            product.status === 'Active' ? 'bg-green-100 text-green-800' :
                            product.status === 'Out of Stock' ? 'bg-red-100 text-red-800' :
                            'bg-yellow-100 text-yellow-800'
                          }`}>
                            {product.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <div className="flex gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="p-2"
                              onClick={() => navigate(`/product/${product.id}`)}
                            >
                              <Eye size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="p-2"
                              onClick={() => navigate(`/admin/products/edit/${product.id}`)}
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="p-2 text-red-500"
                              onClick={() => handleDeleteProduct(product.id, product.name)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {filteredProducts.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    No products found matching your search criteria
                  </div>
                )}
              </div>
            )
          )}
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {loading ? "..." : filteredProducts.length} of {products.length} products
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-tommyfx-blue text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Products;
