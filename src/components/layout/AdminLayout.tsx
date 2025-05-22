
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  Users, 
  Settings, 
  MessageSquare,
  BarChart,
  LogOut,
  Menu,
  X,
  Bell
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';
import { Mail } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, user, loading, signOut } = useAuth();
  const [redirected, setRedirected] = useState(false);
  
  useEffect(() => {
    if (loading) {
      // Wait for loading to complete
      return;
    }
    
    // Only redirect if we haven't already and user is not admin
    if (!redirected && (!user || !isAdmin)) {
      console.log('AdminLayout: Access denied', { user: !!user, isAdmin });
      toast({
        title: "Access denied",
        description: "You need to be an admin to access this page",
        variant: "destructive"
      });
      setRedirected(true);
      navigate('/login');
    }
  }, [isAdmin, user, loading, navigate, redirected]);
  
  const navigation = [
    {
      name: 'Dashboard',
      href: '/admin',
      icon: LayoutDashboard,
      current: location.pathname === '/admin'
    },
    {
      name: 'Orders',
      href: '/admin/orders',
      icon: ShoppingBag,
      current: location.pathname === '/admin/orders'
    },
    {
      name: 'Products',
      href: '/admin/products',
      icon: Package,
      current: location.pathname === '/admin/products'
    },
    {
      name: 'Feedback',
      href: '/admin/feedback',
      icon: MessageSquare,
      current: location.pathname === '/admin/feedback'
    },
    {
      name: 'Customers',
      href: '/admin/customers',
      icon: Users,
      current: location.pathname.includes('/admin/customers')
    },
    // {
    //   name: 'Analytics',
    //   href: '/admin/analytics',
    //   icon: BarChart,
    //   current: location.pathname === '/admin/analytics'
    // },
    {
      name: 'Newsletter',
      href: '/admin/newsletter',
      icon: Mail,
      current: location.pathname === '/admin/newsletter'
    },
    {
      name: 'Settings',
      href: '/admin/settings',
      icon: Settings,
      current: location.pathname === '/admin/settings'
    }
  ];
  
  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
      </div>
    );
  }
  
  // Don't render content if user is not admin
  if (!user || !isAdmin) {
    return null; // Don't render content, redirect happens in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed inset-y-0 left-0 bg-white shadow-md w-64 transform transition-transform duration-300 ease-in-out z-30 lg:relative lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Sidebar header */}
          <div className="flex items-center justify-between px-4 py-5 border-b">
            <Link to="/" className="flex items-center">
              <span className="font-serif font-bold text-xl text-tommyfx-black">
                Tommy<span className="text-tommyfx-blue">FX</span>
              </span>
              <span className="ml-2 text-xs font-semibold uppercase bg-gray-100 px-2 py-0.5 rounded">
                Admin
              </span>
            </Link>
            <button 
              onClick={() => setSidebarOpen(false)} 
              className="lg:hidden p-2 -mr-2"
            >
              <X size={20} />
            </button>
          </div>
          
          {/* Navigation Links */}
          <nav className="flex-1 overflow-y-auto py-4 px-3">
            <ul className="space-y-1">
              {navigation.map(item => (
                <li key={item.name}>
                  <Link 
                    to={item.href}
                    className={`flex items-center px-3 py-2.5 rounded-md font-medium ${
                      item.current
                        ? 'bg-tommyfx-blue text-white'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <item.icon 
                      size={18} 
                      className={`mr-3 ${item.current ? '' : 'text-gray-500'}`} 
                    />
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          
          {/* Sidebar footer */}
          <div className="p-4 border-t">
            <button 
              onClick={handleLogout}
              className="flex items-center text-gray-700 hover:text-tommyfx-blue w-full"
            >
              <LogOut size={18} className="mr-3 text-gray-500" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navbar */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between px-6 py-4">
            <button 
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 mr-4 text-gray-500 hover:text-gray-700"
            >
              <Menu size={24} />
            </button>
            
            <div className="flex items-center ml-auto">
              {/* Notifications */}
              <div className="mr-4 relative">
                <button className="p-2 rounded-full hover:bg-gray-100">
                  <Bell size={20} />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
              </div>
              
              {/* Admin profile */}
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-tommyfx-blue text-white flex items-center justify-center">
                  A
                </div>
                <div className="ml-3 hidden md:block">
                  <p className="font-medium">Admin User</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
