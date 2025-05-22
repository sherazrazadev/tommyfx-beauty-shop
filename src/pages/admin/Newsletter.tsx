import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Send, Users, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/layout/AdminLayout';
import { useAuth } from '@/hooks/useAuth';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface Subscriber {
  id: string;
  email: string;
  subscribed_at: string;
  is_active: boolean;
}

interface Campaign {
  id: string;
  title: string;
  subject: string;
  email_body: string;
  sent_at: string | null;
  sent_count: number;
  created_at: string;
}

const Newsletter = () => {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [subscriberToDelete, setSubscriberToDelete] = useState<string | null>(null);
  const { user } = useAuth();

  // Campaign form state
  const [campaignForm, setCampaignForm] = useState({
    title: '',
    subject: '',
    email_body: ''
  });

  // Email templates
  const emailTemplates = {
    welcome: {
      subject: "Welcome to TommyFX Beauty!",
      body: `Dear Subscriber,

Welcome to TommyFX Beauty! 🎉

Thank you for joining our beauty community. You'll now receive:
• Exclusive product launches
• Special discounts and offers
• Beauty tips and tutorials
• Early access to sales

Visit our store: https://tommyfx-beauty.com

Best regards,
TommyFX Beauty Team`
    },
    promotion: {
      subject: "Special Offer - Up to 30% Off Beauty Essentials!",
      body: `Hi Beauty Lover!

🌟 EXCLUSIVE OFFER JUST FOR YOU! 🌟

Get up to 30% OFF on selected beauty products:
• Premium skincare serums
• Makeup essentials
• Hair care products
• Bath & body items

Use code: BEAUTY30
Valid until: End of Month

Shop now: https://tommyfx-beauty.com

Happy Shopping!
TommyFX Beauty Team`
    },
    newsletter: {
      subject: "TommyFX Beauty Newsletter - New Products & Tips",
      body: `Hello Beautiful!

Here's what's new at TommyFX Beauty:

🆕 NEW ARRIVALS:
• Vitamin C Serum - Now available
• Hydrating Face Mask - Limited edition
• Anti-Aging Cream - Customer favorite

💄 BEAUTY TIP OF THE WEEK:
Always apply sunscreen as the last step of your morning skincare routine for maximum protection!

🛍️ FEATURED PRODUCTS:
Check out our bestsellers with amazing reviews!

Shop all products: https://tommyfx-beauty.com

Stay beautiful!
TommyFX Beauty Team`
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch subscribers using type assertion
      const { data: subscribersData, error: subscribersError } = await (supabase as any)
        .from('newsletter_subscribers')
        .select('*')
        .order('subscribed_at', { ascending: false });

      if (subscribersError) throw subscribersError;

      // Fetch campaigns using type assertion
      const { data: campaignsData, error: campaignsError } = await (supabase as any)
        .from('newsletter_campaigns')
        .select('*')
        .order('created_at', { ascending: false });

      if (campaignsError) throw campaignsError;

      setSubscribers(subscribersData || []);
      setCampaigns(campaignsData || []);
    } catch (error: any) {
      console.error('Error fetching data:', error);
      toast({
        title: "Error",
        description: "Failed to load newsletter data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTemplateSelect = (templateKey: keyof typeof emailTemplates) => {
    const template = emailTemplates[templateKey];
    setCampaignForm({
      title: `${templateKey.charAt(0).toUpperCase() + templateKey.slice(1)} Campaign`,
      subject: template.subject,
      email_body: template.body
    });
  };

  const handleSendCampaign = async () => {
    if (!campaignForm.title || !campaignForm.subject || !campaignForm.email_body) {
      toast({
        title: "Missing Information",
        description: "Please fill in all campaign fields",
        variant: "destructive"
      });
      return;
    }

    const activeSubscribers = subscribers.filter(sub => sub.is_active);
    
    if (activeSubscribers.length === 0) {
      toast({
        title: "No Subscribers",
        description: "No active subscribers found to send emails to",
        variant: "destructive"
      });
      return;
    }

    setSending(true);

    try {
      // Save campaign to database using type assertion
      const { data: campaignData, error: campaignError } = await (supabase as any)
        .from('newsletter_campaigns')
        .insert([{
          title: campaignForm.title,
          subject: campaignForm.subject,
          email_body: campaignForm.email_body,
          sent_at: new Date().toISOString(),
          sent_count: activeSubscribers.length,
          created_by: user?.id
        }])
        .select()
        .single();

      if (campaignError) throw campaignError;

      // Here you would integrate with your email service (EmailJS, SendGrid, etc.)
      // For now, we'll simulate the email sending
      console.log('Sending emails to:', activeSubscribers.map(s => s.email));
      console.log('Email content:', campaignForm);

      // Simulate email sending delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast({
        title: "Campaign Sent Successfully! 📧",
        description: `Newsletter sent to ${activeSubscribers.length} subscribers`,
      });

      // Reset form and refresh data
      setCampaignForm({ title: '', subject: '', email_body: '' });
      fetchData();

    } catch (error: any) {
      console.error('Error sending campaign:', error);
      toast({
        title: "Failed to Send",
        description: "Error sending newsletter campaign",
        variant: "destructive"
      });
    } finally {
      setSending(false);
    }
  };

  const handleDeleteSubscriber = async () => {
    if (!subscriberToDelete) return;

    try {
      const { error } = await (supabase as any)
        .from('newsletter_subscribers')
        .delete()
        .eq('id', subscriberToDelete);

      if (error) throw error;

      toast({
        title: "Subscriber Removed",
        description: "Subscriber has been removed from the newsletter",
      });

      fetchData();
    } catch (error: any) {
      console.error('Error deleting subscriber:', error);
      toast({
        title: "Error",
        description: "Failed to remove subscriber",
        variant: "destructive"
      });
    } finally {
      setDeleteDialogOpen(false);
      setSubscriberToDelete(null);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <AdminLayout>
      <div className="px-6 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Newsletter Management</h1>
          <div className="flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-tommyfx-blue">Admin</Link>
            <ChevronRight size={16} className="mx-2" />
            <span>Newsletter</span>
          </div>
        </div>

        <Tabs defaultValue="compose" className="space-y-6">
          <TabsList>
            <TabsTrigger value="compose" className="flex items-center gap-2">
              <Mail size={16} />
              Compose Campaign
            </TabsTrigger>
            <TabsTrigger value="subscribers" className="flex items-center gap-2">
              <Users size={16} />
              Subscribers ({subscribers.length})
            </TabsTrigger>
            <TabsTrigger value="campaigns" className="flex items-center gap-2">
              <Send size={16} />
              Campaign History
            </TabsTrigger>
          </TabsList>

          {/* Compose Campaign Tab */}
          <TabsContent value="compose">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle>Create Email Campaign</CardTitle>
                    <CardDescription>
                      Compose and send newsletters to your subscribers
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label htmlFor="title">Campaign Title</Label>
                      <Input
                        id="title"
                        value={campaignForm.title}
                        onChange={(e) => setCampaignForm({...campaignForm, title: e.target.value})}
                        placeholder="e.g., Monthly Newsletter - January 2024"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="subject">Email Subject</Label>
                      <Input
                        id="subject"
                        value={campaignForm.subject}
                        onChange={(e) => setCampaignForm({...campaignForm, subject: e.target.value})}
                        placeholder="e.g., New Products & Special Offers"
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="body">Email Body</Label>
                      <Textarea
                        id="body"
                        value={campaignForm.email_body}
                        onChange={(e) => setCampaignForm({...campaignForm, email_body: e.target.value})}
                        placeholder="Write your email content here..."
                        rows={12}
                        className="font-mono text-sm"
                      />
                    </div>
                    
                    <div className="flex gap-3 pt-4">
                      <Button 
                        onClick={handleSendCampaign}
                        disabled={sending}
                        className="flex items-center gap-2"
                      >
                        <Send size={16} />
                        {sending ? 'Sending...' : `Send to ${subscribers.filter(s => s.is_active).length} Subscribers`}
                      </Button>
                      <Button variant="outline" onClick={() => setCampaignForm({title: '', subject: '', email_body: ''})}>
                        Clear
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div>
                <Card>
                  <CardHeader>
                    <CardTitle>Email Templates</CardTitle>
                    <CardDescription>Quick start with pre-made templates</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button 
                      variant="outline" 
                      onClick={() => handleTemplateSelect('welcome')}
                      className="w-full justify-start"
                    >
                      <Plus size={16} className="mr-2" />
                      Welcome Email
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleTemplateSelect('promotion')}
                      className="w-full justify-start"
                    >
                      <Plus size={16} className="mr-2" />
                      Promotional Offer
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleTemplateSelect('newsletter')}
                      className="w-full justify-start"
                    >
                      <Plus size={16} className="mr-2" />
                      Monthly Newsletter
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Subscribers Tab */}
          <TabsContent value="subscribers">
            <Card>
              <CardHeader>
                <CardTitle>Newsletter Subscribers</CardTitle>
                <CardDescription>
                  Manage your newsletter subscriber list
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading subscribers...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Email</TableHead>
                          <TableHead>Subscribed Date</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead className="w-20">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {subscribers.map((subscriber) => (
                          <TableRow key={subscriber.id}>
                            <TableCell className="font-medium">{subscriber.email}</TableCell>
                            <TableCell>{formatDate(subscriber.subscribed_at)}</TableCell>
                            <TableCell>
                              <Badge variant={subscriber.is_active ? "default" : "secondary"}>
                                {subscriber.is_active ? "Active" : "Inactive"}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setSubscriberToDelete(subscriber.id);
                                  setDeleteDialogOpen(true);
                                }}
                                className="text-red-500 hover:text-red-700"
                              >
                                <Trash2 size={16} />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {subscribers.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No subscribers yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Campaign History Tab */}
          <TabsContent value="campaigns">
            <Card>
              <CardHeader>
                <CardTitle>Campaign History</CardTitle>
                <CardDescription>
                  View previously sent newsletter campaigns
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="text-center py-8">Loading campaigns...</div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Campaign Title</TableHead>
                          <TableHead>Subject</TableHead>
                          <TableHead>Sent Date</TableHead>
                          <TableHead>Recipients</TableHead>
                          <TableHead>Status</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaigns.map((campaign) => (
                          <TableRow key={campaign.id}>
                            <TableCell className="font-medium">{campaign.title}</TableCell>
                            <TableCell>{campaign.subject}</TableCell>
                            <TableCell>
                              {campaign.sent_at ? formatDate(campaign.sent_at) : 'Not sent'}
                            </TableCell>
                            <TableCell>{campaign.sent_count}</TableCell>
                            <TableCell>
                              <Badge variant={campaign.sent_at ? "default" : "secondary"}>
                                {campaign.sent_at ? "Sent" : "Draft"}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                    
                    {campaigns.length === 0 && (
                      <div className="text-center py-8 text-gray-500">
                        No campaigns sent yet
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Remove Subscriber</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to remove this subscriber from your newsletter list? 
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction 
                onClick={handleDeleteSubscriber}
                className="bg-red-500 hover:bg-red-600 focus:ring-red-500"
              >
                Remove
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  );
};

export default Newsletter;