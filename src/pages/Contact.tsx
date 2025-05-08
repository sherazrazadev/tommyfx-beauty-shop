
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Mail, Phone, MapPin, Clock, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Contact = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log('Contact form submitted');
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
                        123 Beauty Lane, Fashion District<br />
                        New York, NY 10001
                      </address>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Phone size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Call Us</h3>
                      <p className="text-gray-600">
                        <a href="tel:+15551234567" className="hover:text-tommyfx-blue">
                          +1 (555) 123-4567
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Mail size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Email Us</h3>
                      <p className="text-gray-600">
                        <a href="mailto:contact@tommyfx.com" className="hover:text-tommyfx-blue">
                          contact@tommyfx.com
                        </a>
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <Clock size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                    <div>
                      <h3 className="font-medium">Business Hours</h3>
                      <p className="text-gray-600">
                        Monday - Friday: 9am - 6pm<br />
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
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      F
                    </div>
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      T
                    </div>
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      I
                    </div>
                  </a>
                  <a href="#" className="hover:opacity-80 transition-opacity">
                    <div className="w-10 h-10 rounded-full bg-white bg-opacity-20 flex items-center justify-center">
                      P
                    </div>
                  </a>
                </div>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 rounded-lg shadow-sm">
                <h2 className="text-2xl font-bold mb-6">Send a Message</h2>
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="name" className="block mb-2 font-medium">
                        Your Name*
                      </label>
                      <input
                        type="text"
                        id="name"
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
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    />
                  </div>
                  
                  <div className="mb-6">
                    <label htmlFor="message" className="block mb-2 font-medium">
                      Your Message*
                    </label>
                    <textarea
                      id="message"
                      rows={6}
                      className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                      required
                    ></textarea>
                  </div>
                  
                  <Button type="submit" className="btn-primary flex items-center">
                    <Send size={18} className="mr-2" />
                    Send Message
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-2xl font-bold mb-6 text-center">Find Us</h2>
          <div className="aspect-video bg-gray-200 rounded-lg overflow-hidden">
            {/* Replace with actual map implementation */}
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              <p>Map will be displayed here (Replace with Google Maps or other map service)</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container-custom max-w-4xl">
          <h2 className="text-2xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">What are your shipping rates?</h3>
              <p className="text-gray-600">
                We offer free shipping on all orders over $50 within the United States. 
                For orders under $50, a flat rate of $5.99 applies. International shipping 
                rates vary by destination.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">How can I track my order?</h3>
              <p className="text-gray-600">
                Once your order ships, you'll receive a confirmation email with tracking information. 
                You can also track your order by logging into your account on our website.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">What is your return policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day return policy on all unused and unopened products. 
                To initiate a return, please contact our customer service team.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold mb-2">Are your products cruelty-free?</h3>
              <p className="text-gray-600">
                Yes, all TommyFX products are 100% cruelty-free. We never test on animals 
                and don't work with suppliers who do.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact;
