
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Save, Globe, Mail, Bell, Shield, User, Key } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminLayout from '@/components/layout/AdminLayout';

const Settings = () => {
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('general');
  
  // General settings
  const [storeName, setStoreName] = useState('TommyFX Beauty');
  const [storeEmail, setStoreEmail] = useState('info@tommyfx-beauty.com');
  const [storePhone, setStorePhone] = useState('+1 (555) 123-4567');
  const [storeAddress, setStoreAddress] = useState('123 Beauty Ave, New York, NY 10001');
  const [storeLogo, setStoreLogo] = useState('');
  const [storeDescription, setStoreDescription] = useState('Premium beauty products for every skin type.');
  const [defaultCurrency, setDefaultCurrency] = useState('PKR');
  
  // Email settings
  const [orderConfirmationTemplate, setOrderConfirmationTemplate] = useState('');
  const [welcomeEmailTemplate, setWelcomeEmailTemplate] = useState('');
  const [shipmentNotificationTemplate, setShipmentNotificationTemplate] = useState('');
  const [sendOrderConfirmation, setSendOrderConfirmation] = useState(true);
  const [sendShipmentUpdates, setSendShipmentUpdates] = useState(true);
  const [sendMarketingEmails, setSendMarketingEmails] = useState(false);
  
  // Notification settings
  const [lowStockThreshold, setLowStockThreshold] = useState('5');
  const [notifyOnOrder, setNotifyOnOrder] = useState(true);
  const [notifyOnLowStock, setNotifyOnLowStock] = useState(true);
  const [notifyOnContactForm, setNotifyOnContactForm] = useState(true);
  const [notifyOnFeedback, setNotifyOnFeedback] = useState(true);
  
  // Security settings
  const [requireEmailVerification, setRequireEmailVerification] = useState(true);
  const [allowGuestCheckout, setAllowGuestCheckout] = useState(true);
  const [enableTwoFactorAuth, setEnableTwoFactorAuth] = useState(false);
  const [passwordStrengthLevel, setPasswordStrengthLevel] = useState('medium');
  
  const handleSave = (tab: string) => {
    setSaving(true);
    
    // Simulate saving to the server
    setTimeout(() => {
      setSaving(false);
      toast({
        title: 'Settings Saved',
        description: `Your ${tab} settings have been updated successfully.`,
      });
    }, 800);
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Settings</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Settings</span>
          </div>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 grid grid-cols-4 md:w-fit">
            <TabsTrigger value="general" className="flex items-center">
              <Globe size={16} className="mr-2" />
              <span className="hidden sm:inline">General</span>
            </TabsTrigger>
            <TabsTrigger value="email" className="flex items-center">
              <Mail size={16} className="mr-2" />
              <span className="hidden sm:inline">Email</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center">
              <Bell size={16} className="mr-2" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center">
              <Shield size={16} className="mr-2" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
          </TabsList>
          
          {/* General Settings */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>General Settings</CardTitle>
                <CardDescription>
                  Configure your store's basic information and appearance.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('general'); }} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Store Name</Label>
                      <Input 
                        id="store-name" 
                        value={storeName} 
                        onChange={(e) => setStoreName(e.target.value)}
                        placeholder="Your Store Name" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Contact Email</Label>
                      <Input 
                        id="store-email" 
                        type="email" 
                        value={storeEmail} 
                        onChange={(e) => setStoreEmail(e.target.value)}
                        placeholder="contact@example.com" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Contact Phone</Label>
                      <Input 
                        id="store-phone" 
                        value={storePhone} 
                        onChange={(e) => setStorePhone(e.target.value)}
                        placeholder="+1 (555) 123-4567" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-address">Address</Label>
                      <Input 
                        id="store-address" 
                        value={storeAddress} 
                        onChange={(e) => setStoreAddress(e.target.value)}
                        placeholder="Store Address" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="store-logo">Logo URL</Label>
                      <Input 
                        id="store-logo" 
                        value={storeLogo} 
                        onChange={(e) => setStoreLogo(e.target.value)}
                        placeholder="https://example.com/logo.png" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="default-currency">Default Currency</Label>
                      <Select value={defaultCurrency} onValueChange={setDefaultCurrency}>
                        <SelectTrigger id="default-currency">
                          <SelectValue placeholder="Select Currency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PKR">PKR - PAK Rupee</SelectItem>

                          <SelectItem value="USD">USD - US Dollar</SelectItem>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="GBP">GBP - British Pound</SelectItem>
                          <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                          <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="store-description">Store Description</Label>
                    <Textarea 
                      id="store-description" 
                      value={storeDescription} 
                      onChange={(e) => setStoreDescription(e.target.value)}
                      placeholder="Brief description of your store" 
                      rows={4}
                    />
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Email Settings */}
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure email templates and notification preferences.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('email'); }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="order-confirmation">Order Confirmation Emails</Label>
                        <p className="text-sm text-gray-500">
                          Send an email when a customer completes an order
                        </p>
                      </div>
                      <Switch 
                        id="order-confirmation" 
                        checked={sendOrderConfirmation} 
                        onCheckedChange={setSendOrderConfirmation} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="shipment-updates">Shipment Update Emails</Label>
                        <p className="text-sm text-gray-500">
                          Send an email when an order's shipping status changes
                        </p>
                      </div>
                      <Switch 
                        id="shipment-updates" 
                        checked={sendShipmentUpdates} 
                        onCheckedChange={setSendShipmentUpdates} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="marketing-emails">Marketing Emails</Label>
                        <p className="text-sm text-gray-500">
                          Send promotional emails and newsletters to customers
                        </p>
                      </div>
                      <Switch 
                        id="marketing-emails" 
                        checked={sendMarketingEmails} 
                        onCheckedChange={setSendMarketingEmails} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-4 pt-4 border-t">
                    <h3 className="text-lg font-medium">Email Templates</h3>
                    
                    <div className="space-y-2">
                      <Label htmlFor="order-template">Order Confirmation Template</Label>
                      <Textarea 
                        id="order-template" 
                        value={orderConfirmationTemplate} 
                        onChange={(e) => setOrderConfirmationTemplate(e.target.value)}
                        placeholder="HTML template for order confirmation emails" 
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        Available variables: {"{customer_name}"}, {"{order_id}"}, {"{order_total}"}, {"{order_items}"}
                      </p>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="welcome-template">Welcome Email Template</Label>
                      <Textarea 
                        id="welcome-template" 
                        value={welcomeEmailTemplate} 
                        onChange={(e) => setWelcomeEmailTemplate(e.target.value)}
                        placeholder="HTML template for welcome emails" 
                        rows={4}
                      />
                      <p className="text-sm text-gray-500">
                        Available variables: {"{customer_name}"}, {"{login_url}"}
                      </p>
                    </div>
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Settings</CardTitle>
                <CardDescription>
                  Configure admin notifications and alerts.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('notifications'); }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-orders">New Order Notifications</Label>
                        <p className="text-sm text-gray-500">
                          Receive a notification when a new order is placed
                        </p>
                      </div>
                      <Switch 
                        id="notify-orders" 
                        checked={notifyOnOrder} 
                        onCheckedChange={setNotifyOnOrder} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-stock">Low Stock Alerts</Label>
                        <p className="text-sm text-gray-500">
                          Receive a notification when product stock falls below threshold
                        </p>
                      </div>
                      <Switch 
                        id="notify-stock" 
                        checked={notifyOnLowStock} 
                        onCheckedChange={setNotifyOnLowStock} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-contact">Contact Form Submissions</Label>
                        <p className="text-sm text-gray-500">
                          Receive a notification when a customer submits the contact form
                        </p>
                      </div>
                      <Switch 
                        id="notify-contact" 
                        checked={notifyOnContactForm} 
                        onCheckedChange={setNotifyOnContactForm} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="notify-feedback">New Feedback/Reviews</Label>
                        <p className="text-sm text-gray-500">
                          Receive a notification when customers submit reviews or feedback
                        </p>
                      </div>
                      <Switch 
                        id="notify-feedback" 
                        checked={notifyOnFeedback} 
                        onCheckedChange={setNotifyOnFeedback} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="stock-threshold">Low Stock Threshold</Label>
                    <div className="max-w-xs">
                      <Input 
                        id="stock-threshold" 
                        type="number" 
                        min="1"
                        value={lowStockThreshold} 
                        onChange={(e) => setLowStockThreshold(e.target.value)}
                      />
                    </div>
                    <p className="text-sm text-gray-500">
                      Products with stock below this number will trigger low stock alerts
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Security Settings */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Configure security and authentication settings.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={(e) => { e.preventDefault(); handleSave('security'); }} className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="email-verification">Require Email Verification</Label>
                        <p className="text-sm text-gray-500">
                          New users must verify their email address before logging in
                        </p>
                      </div>
                      <Switch 
                        id="email-verification" 
                        checked={requireEmailVerification} 
                        onCheckedChange={setRequireEmailVerification} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="guest-checkout">Allow Guest Checkout</Label>
                        <p className="text-sm text-gray-500">
                          Customers can place orders without creating an account
                        </p>
                      </div>
                      <Switch 
                        id="guest-checkout" 
                        checked={allowGuestCheckout} 
                        onCheckedChange={setAllowGuestCheckout} 
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5">
                        <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
                        <p className="text-sm text-gray-500">
                          Require two-factor authentication for admin accounts
                        </p>
                      </div>
                      <Switch 
                        id="two-factor" 
                        checked={enableTwoFactorAuth} 
                        onCheckedChange={setEnableTwoFactorAuth} 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2 pt-4 border-t">
                    <Label htmlFor="password-strength">Password Strength Requirements</Label>
                    <Select value={passwordStrengthLevel} onValueChange={setPasswordStrengthLevel}>
                      <SelectTrigger id="password-strength">
                        <SelectValue placeholder="Select Password Requirements" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low (minimum 6 characters)</SelectItem>
                        <SelectItem value="medium">Medium (8+ chars, letters & numbers)</SelectItem>
                        <SelectItem value="high">High (8+ chars, uppercase, lowercase, numbers)</SelectItem>
                        <SelectItem value="very-high">Very High (12+ chars, uppercase, lowercase, numbers, symbols)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      Set the minimum requirements for user passwords
                    </p>
                  </div>
                  
                  <Button type="submit" disabled={saving}>
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default Settings;
