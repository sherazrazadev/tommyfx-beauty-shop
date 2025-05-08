
import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronRight, 
  ShoppingBag, 
  Package, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';

// Mock data
const recentOrders = [
  {
    id: 'ORD-12345',
    customer: 'Emma Johnson',
    date: 'June 15, 2025',
    status: 'Delivered',
    amount: 94.97
  },
  {
    id: 'ORD-12344',
    customer: 'Michael Brown',
    date: 'June 14, 2025',
    status: 'Processing',
    amount: 64.97
  },
  {
    id: 'ORD-12343',
    customer: 'Sophia Martinez',
    date: 'June 14, 2025',
    status: 'Shipped',
    amount: 129.99
  },
  {
    id: 'ORD-12342',
    customer: 'James Wilson',
    date: 'June 13, 2025',
    status: 'Delivered',
    amount: 78.50
  },
  {
    id: 'ORD-12341',
    customer: 'Olivia Taylor',
    date: 'June 13, 2025',
    status: 'Pending',
    amount: 45.75
  }
];

const lowStockProducts = [
  { id: 'P123', name: 'Hydrating Facial Serum', stock: 5, category: 'Skincare' },
  { id: 'P234', name: 'Matte Finish Foundation', stock: 3, category: 'Makeup' },
  { id: 'P345', name: 'Rose Perfume Spray', stock: 2, category: 'Fragrance' }
];

const Dashboard = () => {
  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Dashboard</span>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 font-medium">Total Orders</h3>
              <div className="bg-blue-100 p-2 rounded-full">
                <ShoppingBag size={20} className="text-tommyfx-blue" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold">254</span>
              <span className="ml-2 text-sm text-green-500">+12% ↑</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Last 30 days</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 font-medium">Revenue</h3>
              <div className="bg-green-100 p-2 rounded-full">
                <DollarSign size={20} className="text-green-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold">$8,740</span>
              <span className="ml-2 text-sm text-green-500">+5.2% ↑</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Last 30 days</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 font-medium">Products</h3>
              <div className="bg-purple-100 p-2 rounded-full">
                <Package size={20} className="text-purple-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold">128</span>
              <span className="ml-2 text-sm text-purple-500">+3 new</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Total products</p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-gray-500 font-medium">Customers</h3>
              <div className="bg-yellow-100 p-2 rounded-full">
                <Users size={20} className="text-yellow-600" />
              </div>
            </div>
            <div className="flex items-end">
              <span className="text-3xl font-bold">520</span>
              <span className="ml-2 text-sm text-green-500">+18% ↑</span>
            </div>
            <p className="text-gray-500 text-sm mt-1">Total registered</p>
          </div>
        </div>
        
        {/* Charts & Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Sales Overview</h3>
              <select className="border rounded-md p-1 text-sm">
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
            </div>
            <div className="h-60 flex items-center justify-center bg-gray-50 rounded">
              <TrendingUp size={48} className="text-gray-300" />
              <span className="ml-2 text-gray-500">Sales Chart (Replace with actual chart)</span>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold">Popular Products</h3>
              <Link to="/admin/products" className="text-tommyfx-blue text-sm">
                View All
              </Link>
            </div>
            <div className="h-60 flex items-center justify-center bg-gray-50 rounded">
              <Package size={48} className="text-gray-300" />
              <span className="ml-2 text-gray-500">Products Chart (Replace with actual chart)</span>
            </div>
          </div>
        </div>
        
        {/* Recent Orders */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold">Recent Orders</h3>
            <Link to="/admin/orders" className="text-tommyfx-blue text-sm">
              View All Orders
            </Link>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="p-3 font-medium">Order ID</th>
                  <th className="p-3 font-medium">Customer</th>
                  <th className="p-3 font-medium">Date</th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Amount</th>
                  <th className="p-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map(order => (
                  <tr key={order.id} className="border-t">
                    <td className="p-3">{order.id}</td>
                    <td className="p-3">{order.customer}</td>
                    <td className="p-3">{order.date}</td>
                    <td className="p-3">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                        order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-3">${order.amount.toFixed(2)}</td>
                    <td className="p-3">
                      <Button variant="outline" size="sm">View</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Low Stock Alert */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <AlertCircle size={20} className="text-red-500 mr-2" />
              <h3 className="font-bold">Low Stock Alert</h3>
            </div>
            
            <div className="space-y-3">
              {lowStockProducts.map(product => (
                <div key={product.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <div>
                    <h4 className="font-medium">{product.name}</h4>
                    <p className="text-sm text-gray-500">{product.category}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-red-500">
                      {product.stock} left
                    </span>
                    <Button variant="link" size="sm" className="text-tommyfx-blue p-0" asChild>
                      <Link to={`/admin/products/${product.id}`}>Restock</Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            <Button variant="outline" className="w-full mt-4" asChild>
              <Link to="/admin/products">Manage Inventory</Link>
            </Button>
          </div>
          
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center mb-4">
              <Clock size={20} className="text-tommyfx-blue mr-2" />
              <h3 className="font-bold">Recent Activity</h3>
            </div>
            
            <div className="space-y-4">
              <div className="flex">
                <div className="flex-shrink-0 w-9 relative mr-3">
                  <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center">
                    <ShoppingBag size={16} className="text-tommyfx-blue" />
                  </div>
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3 h-3 w-3 rounded-full border-2 border-white bg-blue-500"></div>
                </div>
                <div>
                  <p className="mb-1">
                    <span className="font-medium">New order</span> placed by{' '}
                    <span className="font-medium">Emma Johnson</span>
                  </p>
                  <span className="text-xs text-gray-500">10 minutes ago</span>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-9 relative mr-3">
                  <div className="h-9 w-9 rounded-full bg-green-100 flex items-center justify-center">
                    <Users size={16} className="text-green-600" />
                  </div>
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3 h-3 w-3 rounded-full border-2 border-white bg-green-500"></div>
                </div>
                <div>
                  <p className="mb-1">
                    <span className="font-medium">New customer</span> registered
                  </p>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-9 relative mr-3">
                  <div className="h-9 w-9 rounded-full bg-yellow-100 flex items-center justify-center">
                    <Package size={16} className="text-yellow-600" />
                  </div>
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3 h-3 w-3 rounded-full border-2 border-white bg-yellow-500"></div>
                </div>
                <div>
                  <p className="mb-1">
                    <span className="font-medium">Product updated:</span> Rose Perfume Spray
                  </p>
                  <span className="text-xs text-gray-500">2 hours ago</span>
                </div>
              </div>
              
              <div className="flex">
                <div className="flex-shrink-0 w-9 relative mr-3">
                  <div className="h-9 w-9 rounded-full bg-purple-100 flex items-center justify-center">
                    <DollarSign size={16} className="text-purple-600" />
                  </div>
                  <div className="absolute top-0 right-0 transform translate-x-1/2 -translate-y-1/3 h-3 w-3 rounded-full border-2 border-white bg-purple-500"></div>
                </div>
                <div>
                  <p className="mb-1">
                    <span className="font-medium">Payment received:</span> $129.99 from James Wilson
                  </p>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </div>
            </div>
            
            <Button variant="link" className="w-full mt-4 text-tommyfx-blue">
              View All Activity
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Dashboard;
