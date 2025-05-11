
import React from 'react';
import AdminLayout from '@/components/layout/AdminLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from '@/components/ui/use-toast';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const storeSettingsSchema = z.object({
  storeName: z.string().min(2, { message: "Store name must be at least 2 characters." }),
  storeEmail: z.string().email({ message: "Please enter a valid email." }),
  storePhone: z.string().optional(),
  storeAddress: z.string().optional(),
  taxRate: z.string().refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0 && num <= 100;
  }, { message: "Tax rate must be between 0 and 100." }),
  enableReviews: z.boolean(),
  enableWishlist: z.boolean(),
  enableDiscounts: z.boolean(),
});

const emailSettingsSchema = z.object({
  smtpServer: z.string().min(1, { message: "SMTP server is required." }),
  smtpPort: z.string().refine((val) => {
    const port = parseInt(val);
    return !isNaN(port) && port > 0 && port <= 65535;
  }, { message: "Port must be between 1 and 65535." }),
  smtpUsername: z.string().min(1, { message: "SMTP username is required." }),
  smtpPassword: z.string().min(1, { message: "SMTP password is required." }),
  fromEmail: z.string().email({ message: "Please enter a valid email." }),
  fromName: z.string().min(1, { message: "From name is required." }),
  enableEmailNotifications: z.boolean(),
});

const SettingsPage = () => {
  const { isAdmin, loading } = useAuth();
  const navigate = useNavigate();

  const storeForm = useForm<z.infer<typeof storeSettingsSchema>>({
    resolver: zodResolver(storeSettingsSchema),
    defaultValues: {
      storeName: "TommyFX Beauty",
      storeEmail: "contact@tommyfxbeauty.com",
      storePhone: "+1 (555) 123-4567",
      storeAddress: "123 Beauty Lane, Los Angeles, CA 90010",
      taxRate: "8.25",
      enableReviews: true,
      enableWishlist: true,
      enableDiscounts: true,
    },
  });

  const emailForm = useForm<z.infer<typeof emailSettingsSchema>>({
    resolver: zodResolver(emailSettingsSchema),
    defaultValues: {
      smtpServer: "smtp.example.com",
      smtpPort: "587",
      smtpUsername: "notifications@tommyfxbeauty.com",
      smtpPassword: "your-smtp-password",
      fromEmail: "notifications@tommyfxbeauty.com",
      fromName: "TommyFX Beauty",
      enableEmailNotifications: true,
    },
  });

  const onStoreSubmit = (values: z.infer<typeof storeSettingsSchema>) => {
    // Here you would typically save these settings to your backend
    console.log(values);
    toast({
      title: "Store settings updated",
      description: "Your store settings have been successfully saved.",
    });
  };

  const onEmailSubmit = (values: z.infer<typeof emailSettingsSchema>) => {
    // Here you would typically save these settings to your backend
    console.log(values);
    toast({
      title: "Email settings updated",
      description: "Your email settings have been successfully saved.",
    });
  };

  // Redirect if not admin
  React.useEffect(() => {
    if (!loading && !isAdmin) {
      toast({
        title: "Access denied",
        description: "You don't have permission to access settings",
        variant: "destructive"
      });
      navigate('/');
    }
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-tommyfx-blue"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return null; // Will redirect in useEffect
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Settings</h1>
        
        <Tabs defaultValue="general" className="space-y-6">
          <TabsList>
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
            <TabsTrigger value="appearance">Appearance</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Store Settings</CardTitle>
                <CardDescription>
                  Manage your store information and features
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...storeForm}>
                  <form onSubmit={storeForm.handleSubmit(onStoreSubmit)} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={storeForm.control}
                        name="storeName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={storeForm.control}
                        name="storeEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Email</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={storeForm.control}
                        name="storePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Store Phone</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={storeForm.control}
                        name="taxRate"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Tax Rate (%)</FormLabel>
                            <FormControl>
                              <Input {...field} type="text" inputMode="decimal" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={storeForm.control}
                      name="storeAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Store Address</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="space-y-4 border-t pt-4">
                      <h3 className="text-lg font-medium">Features</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={storeForm.control}
                          name="enableReviews"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Customer Reviews
                                </FormLabel>
                                <FormDescription>
                                  Allow customers to leave product reviews
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeForm.control}
                          name="enableWishlist"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Wishlist
                                </FormLabel>
                                <FormDescription>
                                  Allow customers to save products to wishlist
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={storeForm.control}
                          name="enableDiscounts"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                              <div className="space-y-0.5">
                                <FormLabel className="text-base">
                                  Discounts
                                </FormLabel>
                                <FormDescription>
                                  Enable product discounts and sale prices
                                </FormDescription>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Settings</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="email">
            <Card>
              <CardHeader>
                <CardTitle>Email Settings</CardTitle>
                <CardDescription>
                  Configure email notifications for your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...emailForm}>
                  <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-6">
                    <div className="space-y-4 border-b pb-4 mb-4">
                      <h3 className="text-lg font-medium">SMTP Configuration</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={emailForm.control}
                          name="smtpServer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SMTP Server</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="smtpPort"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SMTP Port</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="smtpUsername"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SMTP Username</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="smtpPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>SMTP Password</FormLabel>
                              <FormControl>
                                <Input {...field} type="password" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Email Sender</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={emailForm.control}
                          name="fromEmail"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Email</FormLabel>
                              <FormControl>
                                <Input {...field} type="email" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={emailForm.control}
                          name="fromName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>From Name</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                    
                    <FormField
                      control={emailForm.control}
                      name="enableEmailNotifications"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">
                              Email Notifications
                            </FormLabel>
                            <FormDescription>
                              Send emails for orders, account changes, etc.
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button type="submit">Save Email Settings</Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="appearance">
            <Card>
              <CardHeader>
                <CardTitle>Appearance Settings</CardTitle>
                <CardDescription>
                  Customize the look and feel of your store
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Theme Colors</h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Primary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-tommyfx-blue border"></div>
                          <Input defaultValue="#3B82F6" className="w-24" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Secondary Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-pink-500 border"></div>
                          <Input defaultValue="#EC4899" className="w-24" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Background</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-white border"></div>
                          <Input defaultValue="#FFFFFF" className="w-24" />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Text Color</Label>
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-gray-800 border"></div>
                          <Input defaultValue="#1F2937" className="w-24" />
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium">Logo</h3>
                    
                    <div className="flex items-center gap-4">
                      <div className="w-24 h-24 bg-gray-100 border rounded-md flex items-center justify-center">
                        Logo
                      </div>
                      
                      <Button variant="outline">Upload Logo</Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4 border-t pt-4">
                    <h3 className="text-lg font-medium">Typography</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Headings Font</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font">Inter</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                            <SelectItem value="lato">Lato</SelectItem>
                            <SelectItem value="montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label>Body Font</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select font">Inter</SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="inter">Inter</SelectItem>
                            <SelectItem value="roboto">Roboto</SelectItem>
                            <SelectItem value="opensans">Open Sans</SelectItem>
                            <SelectItem value="lato">Lato</SelectItem>
                            <SelectItem value="montserrat">Montserrat</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end">
                    <Button>Save Appearance</Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

// This is needed for the type error from shadcn/ui's Select component
const SelectTrigger = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectValue = ({ placeholder, children }: { placeholder?: string, children?: React.ReactNode }) => 
  <div>{children || placeholder}</div>;
const SelectContent = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;
const SelectItem = ({ value, children }: { value: string, children: React.ReactNode }) => 
  <div>{children}</div>;

export default SettingsPage;
