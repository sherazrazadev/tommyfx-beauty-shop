import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear success message when user starts typing again
    if (submitSuccess) {
      setSubmitSuccess(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validate form data
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      setIsSubmitting(false);
      return;
    }
    
    try {
      // Using 'as any' to bypass TypeScript type checking for now
      const { error } = await (supabase as any)
        .from('contact_submissions')
        .insert([
          { 
            name: formData.name,
            email: formData.email,
            subject: formData.subject || '',
            message: formData.message
          }
        ]);
      
      if (error) throw error;
      
      // Show success state
      setSubmitSuccess(true);
      
      // Reset form but keep the name and email in memory
      const savedName = formData.name;
      const savedEmail = formData.email;
      setFormData({
        name: savedName,
        email: savedEmail,
        subject: '',
        message: ''
      });
      
      // Enhanced success toast with custom content
      toast({
        title: "Message sent successfully!",
        description: (
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Your message has been received</span>
            </div>
            <p>Thanks {savedName}, we'll get back to you soon.</p>
          </div>
        ),
        variant: "default",
        duration: 5000, // Show for 5 seconds
      });
      
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: error.message || "There was an error sending your message",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <section className="bg-gray-100 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <div className="flex items-center justify-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-800">Contact</span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                
                {submitSuccess ? (
                  <div className="bg-green-50 border border-green-100 rounded-lg p-6 text-center mb-6">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mb-4">
                      <CheckCircle size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-green-800 mb-2">Thank You!</h3>
                    <p className="text-green-700 mb-4">
                      Your message has been sent successfully. We'll get back to you as soon as possible.
                    </p>
                    <Button
                      type="button"
                      onClick={() => setSubmitSuccess(false)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                      <div>
                        <label htmlFor="name" className="block mb-2 font-medium">
                          Your Name*
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="email" className="block mb-2 font-medium">
                          Email Address*
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                          required
                        />
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="subject" className="block mb-2 font-medium">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                      />
                    </div>
                    
                    <div className="mb-6">
                      <label htmlFor="message" className="block mb-2 font-medium">
                        Your Message*
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        value={formData.message}
                        onChange={handleChange}
                        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                        required
                      ></textarea>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="btn-primary flex items-center"
                      disabled={isSubmitting}
                    >
                      <Send size={18} className="mr-2" />
                      {isSubmitting ? 'Sending...' : 'Send Message'}
                    </Button>
                  </form>
                )}
              </div>
            </div>
                
                        {/* Contact Information */}
            <div>
              <div className="bg-white p-8 rounded-lg shadow-sm mb-8">
                <h2 className="text-2xl font-bold mb-6">Get In Touch</h2>
                <p className="text-gray-600 mb-6">
                  We'd love to hear from you! Whether you have a question about our products,
                  orders, or anything else, our team is here to help.
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <MapPin size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Visit Us</h3>
                      <address className="text-gray-600 not-italic">
                        Lahore, Punjab, Pakistan
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-gray-600">
                        <a href="tel:+923067145010" className="hover:text-tommyfx-blue">
                          +92 (306) 714-5010
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:tommyfx.pk@gmail.com" className="hover:text-tommyfx-blue">
                          tommyfx.pk@gmail.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600">
                        Saturday: 10am - 4pm<br />
                        Sunday: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-tommyfx-blue text-white p-8 rounded-lg shadow-sm">
                <h3 className="text-xl font-bold mb-4">Follow Us</h3>
                <p className="mb-4">
                  Stay updated with our latest products, tips, and promotions.
                </p>
                <div className="flex space-x-4">
                  <a href="https://www.facebook.com/profile.php?id=61575684157555" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      F
                    </div>
                  </a>
                  <a href="https://www.tiktok.com/@tommyfx.pk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      T
                    </div>
                  </a>
                  <a href="https://www.instagram.com/tommyfx.pk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      I
                    </div>
                  </a>
                  <a href="https://www.pinterest.com/tommyfx.pk" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      P
                    </div>
                  </a>
                </div>
              </div>
            </div>
            

          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6 text-center">Find Us</h2>
          
          {/* Google Maps Embed */}
          <div className="aspect-video bg-white rounded-lg overflow-hidden shadow-md">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d217897.59474300013!2d74.17057895!3d31.482940450000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39190483e58107d9%3A0xc23abe6ccc7e2462!2sLahore%2C%20Punjab%2C%20Pakistan!5e0!3m2!1sen!2sus!4v1716230018303!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="TommyFX Location in Lahore"
              className="rounded-lg"
            ></iframe>
          </div>
          
          <div className="mt-6 text-center text-gray-600">
            <p>We're located in Lahore, Punjab, Pakistan. Visit us today!</p>
            <a 
              href="https://www.google.com/maps/place/Lahore,+Punjab,+Pakistan" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center text-tommyfx-blue hover:underline mt-2"
            >
              <MapPin size={16} className="mr-1" />
              Get directions on Google Maps
            </a>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">What are your shipping rates within Pakistan?</h3>
              <p className="text-gray-600">
                We offer free delivery on all orders above Rs. 3,000 within Pakistan.  
                For orders below this amount, standard delivery charges vary based on location and will be displayed at checkout.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">How can I track my order?</h3>
              <p className="text-gray-600">
                Once your order has been dispatched, you’ll receive an SMS & email notification with your tracking details.  
                You can also check the status of your order by logging into your account on our website.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">What is your return policy?</h3>
              <p className="text-gray-600">
                We accept returns for unused, unopened skincare products within 15 days of purchase.  
                If you receive a damaged or incorrect item, please contact our customer support immediately for assistance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Are your skincare products safe for all skin types?</h3>
              <p className="text-gray-600">
                Yes, our skincare formulations are dermatologically tested and suitable for all skin types,  
                including sensitive skin. If you have any concerns, we recommend doing a patch test before full application.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Are your products cruelty-free?</h3>
              <p className="text-gray-600">
                Absolutely! We are 100% cruelty-free and do not test on animals.  
                All our ingredients are ethically sourced.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};

export default Contact;