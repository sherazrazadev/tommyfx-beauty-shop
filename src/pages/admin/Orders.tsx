
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Search, Filter, ArrowDown, ArrowUp, FileText, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AdminLayout from '@/components/layout/AdminLayout';

// Mock data
const orders = [
  {
    id: 'ORD-12345',
    customer: 'Emma Johnson',
    email: 'emma.j@example.com',
    date: 'June 15, 2025',
    status: 'Delivered',
    payment: 'Credit Card',
    amount: 94.97
  },
  {
    id: 'ORD-12344',
    customer: 'Michael Brown',
    email: 'mbrown@example.com',
    date: 'June 14, 2025',
    status: 'Processing',
    payment: 'PayPal',
    amount: 64.97
  },
  {
    id: 'ORD-12343',
    customer: 'Sophia Martinez',
    email: 's.martinez@example.com',
    date: 'June 14, 2025',
    status: 'Shipped',
    payment: 'Credit Card',
    amount: 129.99
  },
  {
    id: 'ORD-12342',
    customer: 'James Wilson',
    email: 'jwilson@example.com',
    date: 'June 13, 2025',
    status: 'Delivered',
    payment: 'Cash on Delivery',
    amount: 78.50
  },
  {
    id: 'ORD-12341',
    customer: 'Olivia Taylor',
    email: 'o.taylor@example.com',
    date: 'June 13, 2025',
    status: 'Pending',
    payment: 'PayPal',
    amount: 45.75
  },
  {
    id: 'ORD-12340',
    customer: 'Daniel Moore',
    email: 'dmoore@example.com',
    date: 'June 12, 2025',
    status: 'Delivered',
    payment: 'Credit Card',
    amount: 55.20
  },
  {
    id: 'ORD-12339',
    customer: 'Isabella White',
    email: 'iwhite@example.com',
    date: 'June 12, 2025',
    status: 'Cancelled',
    payment: 'Credit Card',
    amount: 89.95
  },
  {
    id: 'ORD-12338',
    customer: 'Ethan Johnson',
    email: 'ethanj@example.com',
    date: 'June 11, 2025',
    status: 'Delivered',
    payment: 'Cash on Delivery',
    amount: 43.25
  },
  {
    id: 'ORD-12337',
    customer: 'Ava Robinson',
    email: 'arobinson@example.com',
    date: 'June 11, 2025',
    status: 'Processing',
    payment: 'PayPal',
    amount: 67.80
  },
  {
    id: 'ORD-12336',
    customer: 'Noah Garcia',
    email: 'ngarcia@example.com',
    date: 'June 10, 2025',
    status: 'Shipped',
    payment: 'Credit Card',
    amount: 104.50
  }
];

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => 
      (statusFilter === 'All' || order.status === statusFilter) &&
      (order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
       order.email.toLowerCase().includes(searchTerm.toLowerCase()))
    )
    .sort((a, b) => {
      // Basic sorting for demo purposes
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
          <h1 className="text-2xl font-bold">Orders Management</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Orders</span>
          </div>
        </div>

        {/* Filters and search */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
            <div className="w-full md:w-auto flex-1">
              <div className="relative">
                <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search orders by ID, customer name or email..."
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
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                  className="border rounded-md py-2 px-3 focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                >
                  <option value="All">All Status</option>
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>
              
              <Button variant="outline" className="flex items-center gap-2">
                <FileText size={18} />
                <span>Export</span>
              </Button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left bg-gray-50">
                  <th className="p-3 font-medium">
                    <button 
                      onClick={() => handleSort('id')} 
                      className="flex items-center focus:outline-none"
                    >
                      Order ID {renderSortIcon('id')}
                    </button>
                  </th>
                  <th className="p-3 font-medium">
                    <button 
                      onClick={() => handleSort('customer')} 
                      className="flex items-center focus:outline-none"
                    >
                      Customer {renderSortIcon('customer')}
                    </button>
                  </th>
                  <th className="p-3 font-medium">
                    <button 
                      onClick={() => handleSort('date')} 
                      className="flex items-center focus:outline-none"
                    >
                      Date {renderSortIcon('date')}
                    </button>
                  </th>
                  <th className="p-3 font-medium">Status</th>
                  <th className="p-3 font-medium">Payment</th>
                  <th className="p-3 font-medium">
                    <button 
                      onClick={() => handleSort('amount')} 
                      className="flex items-center focus:outline-none"
                    >
                      Amount {renderSortIcon('amount')}
                    </button>
                  </th>
                  <th className="p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.length > 0 ? (
                  filteredOrders.map(order => (
                    <tr key={order.id} className="border-t">
                      <td className="p-3 font-medium">{order.id}</td>
                      <td className="p-3">
                        <div>
                          <div>{order.customer}</div>
                          <div className="text-sm text-gray-500">{order.email}</div>
                        </div>
                      </td>
                      <td className="p-3">{order.date}</td>
                      <td className="p-3">
                        <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                          order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                          order.status === 'Processing' ? 'bg-blue-100 text-blue-800' :
                          order.status === 'Shipped' ? 'bg-purple-100 text-purple-800' :
                          order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="p-3">{order.payment}</td>
                      <td className="p-3">${order.amount.toFixed(2)}</td>
                      <td className="p-3">
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">View</Button>
                          <Button variant="outline" size="sm">Update</Button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="p-4 text-center text-gray-500">
                      No orders found matching your search criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          <div className="flex justify-between items-center mt-6">
            <div className="text-sm text-gray-500">
              Showing {filteredOrders.length} of {orders.length} orders
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" disabled>Previous</Button>
              <Button variant="outline" size="sm" className="bg-tommyfx-blue text-white">1</Button>
              <Button variant="outline" size="sm">2</Button>
              <Button variant="outline" size="sm">3</Button>
              <Button variant="outline" size="sm">Next</Button>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default Orders;
