
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Settings, ShoppingBag, Heart, LogOut, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// Mock data
const orders = [
  {
    id: 'ORD-12345',
    date: 'June 15, 2025',
    status: 'Delivered',
    total: 94.97,
    items: [
      {
        id: '1',
        name: 'Hydrating Facial Serum',
        price: 34.99,
        image: 'https://source.unsplash.com/oG8PIWBc3nE',
        quantity: 1
      },
      {
        id: '2',
        name: 'Matte Finish Foundation',
        price: 29.99,
        image: 'https://source.unsplash.com/UKWFNya-YHk',
        quantity: 2
      }
    ]
  },
  {
    id: 'ORD-12344',
    date: 'May 22, 2025',
    status: 'Delivered',
    total: 64.97,
    items: [
      {
        id: '3',
        name: 'Repairing Hair Mask',
        price: 24.99,
        image: 'https://source.unsplash.com/eeAZHchRdgA',
        quantity: 1
      },
      {
        id: '7',
        name: 'Soothing Bath Bombs',
        price: 14.99,
        image: 'https://source.unsplash.com/ql3OpWIeYVw',
        quantity: 1
      },
      {
        id: '9',
        name: 'Exfoliating Face Scrub',
        price: 22.99,
        image: 'https://source.unsplash.com/mEZ3PoFGs_k',
        quantity: 1
      }
    ]
  }
];

const wishlist = [
  {
    id: '5',
    name: 'Anti-Aging Night Cream',
    price: 39.99,
    image: 'https://source.unsplash.com/1Y_EeeOvzQQ',
    category: 'Skincare'
  },
  {
    id: '8',
    name: 'Rose Perfume Spray',
    price: 49.99,
    image: 'https://source.unsplash.com/KLfD2eUNGEY',
    category: 'Fragrance'
  },
  {
    id: '11',
    name: 'Heat Protection Spray',
    price: 18.99,
    image: 'https://source.unsplash.com/dKT6Q_koFRw',
    category: 'Hair'
  }
];

const Profile = () => {
  const [profileData, setProfileData] = useState({
    name: 'Jane Doe',
    email: 'jane.doe@example.com',
    phone: '+1 (555) 123-4567'
  });
  
  const [editing, setEditing] = useState(false);
  const [formValues, setFormValues] = useState({
    name: profileData.name,
    email: profileData.email,
    phone: profileData.phone,
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues({
      ...formValues,
      [name]: value
    });
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Update profile data
    setProfileData({
      name: formValues.name,
      email: formValues.email,
      phone: formValues.phone
    });
    setEditing(false);
  };
  
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle feedback submission
    console.log('Feedback submitted');
  };

  return (
    <div className="bg-gray-50 py-12 min-h-[calc(100vh-5rem)]">
      <div className="container-custom">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-center mb-4">
                <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center mr-3 text-gray-500">
                  {profileData.name.charAt(0)}
                </div>
                <div>
                  <h2 className="font-bold">{profileData.name}</h2>
                  <p className="text-sm text-gray-500">{profileData.email}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
              <div className="p-2">
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <User size={18} className="mr-3 text-tommyfx-blue" />
                  <span>My Profile</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <ShoppingBag size={18} className="mr-3 text-tommyfx-blue" />
                  <span>My Orders</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <Heart size={18} className="mr-3 text-tommyfx-blue" />
                  <span>Wishlist</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <MessageSquare size={18} className="mr-3 text-tommyfx-blue" />
                  <span>Feedback</span>
                </Link>
                <Link 
                  to="/profile" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700"
                >
                  <Settings size={18} className="mr-3 text-tommyfx-blue" />
                  <span>Account Settings</span>
                </Link>
                <Link 
                  to="/" 
                  className="flex items-center p-3 rounded-md hover:bg-gray-50 text-gray-700 mt-4"
                >
                  <LogOut size={18} className="mr-3 text-red-500" />
                  <span>Logout</span>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="md:col-span-3">
            <Tabs defaultValue="orders">
              <TabsList className="w-full bg-white p-0 mb-6">
                <TabsTrigger value="orders" className="flex-1 py-3">Orders</TabsTrigger>
                <TabsTrigger value="wishlist" className="flex-1 py-3">Wishlist</TabsTrigger>
                <TabsTrigger value="profile" className="flex-1 py-3">Profile</TabsTrigger>
                <TabsTrigger value="feedback" className="flex-1 py-3">Feedback</TabsTrigger>
              </TabsList>
              
              {/* Orders Tab */}
              <TabsContent value="orders" className="animate-fade-in">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-6">My Orders</h3>
                  
                  {orders.length > 0 ? (
                    <div className="space-y-6">
                      {orders.map(order => (
                        <div key={order.id} className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 p-4 flex justify-between items-center">
                            <div>
                              <span className="font-medium">{order.id}</span>
                              <p className="text-sm text-gray-500">Placed on {order.date}</p>
                            </div>
                            <div className="text-right">
                              <span className={`inline-block px-3 py-1 rounded-full text-sm ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 
                                'bg-blue-100 text-blue-800'
                              }`}>
                                {order.status}
                              </span>
                              <p className="font-medium mt-1">${order.total.toFixed(2)}</p>
                            </div>
                          </div>
                          
                          <div className="p-4">
                            <div className="space-y-4">
                              {order.items.map(item => (
                                <div key={item.id} className="flex items-center">
                                  <div className="w-16 h-16 rounded overflow-hidden">
                                    <img 
                                      src={item.image} 
                                      alt={item.name} 
                                      className="w-full h-full object-cover" 
                                    />
                                  </div>
                                  <div className="ml-4 flex-1">
                                    <Link 
                                      to={`/product/${item.id}`}
                                      className="font-medium hover:text-tommyfx-blue"
                                    >
                                      {item.name}
                                    </Link>
                                    <div className="flex justify-between mt-1 text-sm text-gray-600">
                                      <span>Qty: {item.quantity}</span>
                                      <span>${item.price.toFixed(2)}</span>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                            
                            <div className="mt-4 flex justify-between">
                              <Button variant="outline" size="sm" asChild>
                                <Link to={`/order/${order.id}`}>
                                  View Order Details
                                </Link>
                              </Button>
                              <Button size="sm">Reorder</Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <ShoppingBag size={48} className="mx-auto text-gray-300 mb-4" />
                      <h4 className="font-medium mb-2">No Orders Yet</h4>
                      <p className="text-gray-600 mb-4">You haven't placed any orders yet.</p>
                      <Button asChild>
                        <Link to="/categories">Start Shopping</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Wishlist Tab */}
              <TabsContent value="wishlist" className="animate-fade-in">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-6">My Wishlist</h3>
                  
                  {wishlist.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {wishlist.map(item => (
                        <div key={item.id} className="border rounded-lg overflow-hidden">
                          <Link to={`/product/${item.id}`} className="block">
                            <div className="aspect-square">
                              <img 
                                src={item.image} 
                                alt={item.name} 
                                className="w-full h-full object-cover" 
                              />
                            </div>
                          </Link>
                          
                          <div className="p-4">
                            <Link 
                              to={`/product/${item.id}`}
                              className="font-medium hover:text-tommyfx-blue"
                            >
                              {item.name}
                            </Link>
                            <p className="text-gray-600">{item.category}</p>
                            <p className="font-medium my-2">${item.price.toFixed(2)}</p>
                            
                            <div className="flex gap-2">
                              <Button size="sm" className="flex-1">
                                Add to Cart
                              </Button>
                              <Button variant="outline" size="sm">
                                Remove
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <Heart size={48} className="mx-auto text-gray-300 mb-4" />
                      <h4 className="font-medium mb-2">Your Wishlist is Empty</h4>
                      <p className="text-gray-600 mb-4">
                        Save items you love by clicking the heart icon.
                      </p>
                      <Button asChild>
                        <Link to="/categories">Browse Products</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              {/* Profile Tab */}
              <TabsContent value="profile" className="animate-fade-in">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold">Profile Information</h3>
                    {!editing && (
                      <Button 
                        variant="ghost" 
                        onClick={() => setEditing(true)}
                      >
                        Edit Profile
                      </Button>
                    )}
                  </div>
                  
                  {!editing ? (
                    <div className="space-y-6">
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Full Name</h4>
                        <p>{profileData.name}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Email Address</h4>
                        <p>{profileData.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm text-gray-500 mb-1">Phone Number</h4>
                        <p>{profileData.phone}</p>
                      </div>
                    </div>
                  ) : (
                    <form onSubmit={handleSubmit}>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label htmlFor="name" className="block mb-1 font-medium">
                            Full Name
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            value={formValues.name}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block mb-1 font-medium">
                            Email Address
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formValues.email}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="block mb-1 font-medium">
                            Phone Number
                          </label>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formValues.phone}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                            required
                          />
                        </div>
                      </div>
                      
                      <h4 className="font-medium mb-3">Change Password (Optional)</h4>
                      <div className="space-y-4 mb-6">
                        <div>
                          <label htmlFor="currentPassword" className="block mb-1 font-medium">
                            Current Password
                          </label>
                          <input
                            type="password"
                            id="currentPassword"
                            name="currentPassword"
                            value={formValues.currentPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block mb-1 font-medium">
                            New Password
                          </label>
                          <input
                            type="password"
                            id="newPassword"
                            name="newPassword"
                            value={formValues.newPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block mb-1 font-medium">
                            Confirm New Password
                          </label>
                          <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            value={formValues.confirmPassword}
                            onChange={handleChange}
                            className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          />
                        </div>
                      </div>
                      
                      <div className="flex gap-3">
                        <Button type="submit">Save Changes</Button>
                        <Button 
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditing(false);
                            setFormValues({
                              name: profileData.name,
                              email: profileData.email,
                              phone: profileData.phone,
                              currentPassword: '',
                              newPassword: '',
                              confirmPassword: ''
                            });
                          }}
                        >
                          Cancel
                        </Button>
                      </div>
                    </form>
                  )}
                </div>
              </TabsContent>
              
              {/* Feedback Tab */}
              <TabsContent value="feedback" className="animate-fade-in">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <h3 className="text-xl font-bold mb-6">Feedback</h3>
                  
                  <form onSubmit={handleFeedbackSubmit}>
                    <div className="mb-4">
                      <label htmlFor="feedbackType" className="block mb-2 font-medium">
                        Type of Feedback
                      </label>
                      <select
                        id="feedbackType"
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                        required
                      >
                        <option value="">Select a type</option>
                        <option value="product">Product</option>
                        <option value="website">Website</option>
                        <option value="service">Customer Service</option>
                        <option value="suggestion">Suggestion</option>
                      </select>
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="rating" className="block mb-2 font-medium">
                        Rating
                      </label>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map(star => (
                          <label key={star} className="cursor-pointer">
                            <input
                              type="radio"
                              name="rating"
                              value={star}
                              className="sr-only"
                            />
                            <div className="w-10 h-10 flex items-center justify-center border rounded-full hover:bg-gray-100">
                              {star}
                            </div>
                          </label>
                        ))}
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="feedback" className="block mb-2 font-medium">
                        Your Feedback
                      </label>
                      <textarea
                        id="feedback"
                        rows={6}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                        placeholder="Tell us what you think or suggest improvements."
                        required
                      ></textarea>
                    </div>
                    
                    <Button type="submit">Submit Feedback</Button>
                  </form>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
