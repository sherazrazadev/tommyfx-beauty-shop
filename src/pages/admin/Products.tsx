
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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

// Mock data
const products = [
  {
    id: 'P1001',
    name: 'Hydrating Facial Serum',
    category: 'Skincare',
    price: 34.99,
    stock: 45,
    status: 'Active',
    image: 'https://source.unsplash.com/oG8PIWBc3nE'
  },
  {
    id: 'P1002',
    name: 'Matte Finish Foundation',
    category: 'Makeup',
    price: 29.99,
    stock: 38,
    status: 'Active',
    image: 'https://source.unsplash.com/UKWFNya-YHk'
  },
  {
    id: 'P1003',
    name: 'Repairing Hair Mask',
    category: 'Hair',
    price: 24.99,
    stock: 27,
    status: 'Active',
    image: 'https://source.unsplash.com/eeAZHchRdgA'
  },
  {
    id: 'P1004',
    name: 'Nourishing Body Oil',
    category: 'Body',
    price: 19.99,
    stock: 32,
    status: 'Active',
    image: 'https://source.unsplash.com/MhOcP0qEZLw'
  },
  {
    id: 'P1005',
    name: 'Anti-Aging Night Cream',
    category: 'Skincare',
    price: 39.99,
    stock: 19,
    status: 'Active',
    image: 'https://source.unsplash.com/1Y_EeeOvzQQ'
  },
  {
    id: 'P1006',
    name: 'Volumizing Mascara',
    category: 'Makeup',
    price: 17.99,
    stock: 54,
    status: 'Active',
    image: 'https://source.unsplash.com/fJTqyZMOh18'
  },
  {
    id: 'P1007',
    name: 'Soothing Bath Bombs',
    category: 'Bath',
    price: 14.99,
    stock: 42,
    status: 'Active',
    image: 'https://source.unsplash.com/ql3OpWIeYVw'
  },
  {
    id: 'P1008',
    name: 'Rose Perfume Spray',
    category: 'Fragrance',
    price: 49.99,
    stock: 15,
    status: 'Low Stock',
    image: 'https://source.unsplash.com/KLfD2eUNGEY'
  },
  {
    id: 'P1009',
    name: 'Exfoliating Face Scrub',
    category: 'Skincare',
    price: 22.99,
    stock: 28,
    status: 'Active',
    image: 'https://source.unsplash.com/mEZ3PoFGs_k'
  },
  {
    id: 'P1010',
    name: 'Hydrating Lip Balm',
    category: 'Makeup',
    price: 12.99,
    stock: 0,
    status: 'Out of Stock',
    image: 'https://source.unsplash.com/eowjK7pqBhk'
  }
];

const categories = ['All', 'Skincare', 'Makeup', 'Hair', 'Body', 'Bath', 'Fragrance'];

const Products = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  // Filter and sort products
  const filteredProducts = products
    .filter(product => 
      (categoryFilter === 'All' || product.category === categoryFilter) &&
      (statusFilter === 'All' || product.status === statusFilter) &&
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aValue = a[sortField as keyof typeof a];
      const bValue = b[sortField as keyof typeof b];
      
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

        {/* Products Display */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold">
              Products ({filteredProducts.length})
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
          
          {view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <div key={product.id} className="border rounded-lg overflow-hidden">
                  <div className="aspect-square relative">
                    <img 
                      src={product.image} 
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
                      <Button variant="outline" size="sm" className="flex-1">Edit</Button>
                      <Button variant="ghost" size="sm" className="text-red-500">Delete</Button>
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
                            src={product.image} 
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
                          <Button variant="outline" size="sm" className="p-2">
                            <Eye size={16} />
                          </Button>
                          <Button variant="outline" size="sm" className="p-2">
                            <Edit size={16} />
                          </Button>
                          <Button variant="outline" size="sm" className="p-2 text-red-500">
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
          )}
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredProducts.length} of {products.length} products
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
