import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/use-toast';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [isSubscribing, setIsSubscribing] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter your email address",
        variant: "destructive"
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address",
        variant: "destructive"
      });
      return;
    }

    setIsSubscribing(true);

    try {
      // Use type assertion to bypass TypeScript errors
      const { error } = await (supabase as any)
        .from('newsletter_subscribers')
        .insert([{ email: email.trim().toLowerCase() }]);

      if (error) {
        // Check if email already exists
        if (error.code === '23505') {
          toast({
            title: "Already Subscribed",
            description: "This email is already subscribed to our newsletter",
            variant: "destructive"
          });
        } else {
          throw error;
        }
      } else {
        toast({
          title: "Successfully Subscribed! 🎉",
          description: "Thank you for subscribing to our newsletter",
        });
        setEmail('');
      }
    } catch (error: any) {
      console.error('Newsletter subscription error:', error);
      toast({
        title: "Subscription Failed",
        description: "Something went wrong. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubscribing(false);
    }
  };

  return (
    <footer className="bg-tommyfx-black text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive offers, beauty tips, and new product releases.
          </p>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-grow p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue text-tommyfx-black"
              disabled={isSubscribing}
              required
            />
            <Button 
              type="submit"
              disabled={isSubscribing}
              className="bg-tommyfx-blue hover:bg-blue-600 transition-colors min-w-[100px]"
            >
              {isSubscribing ? 'Subscribing...' : 'Subscribe'}
            </Button>
          </form>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1: About */}
          <div>
            <h4 className="text-xl mb-4 font-serif">
              Tommy<span className="text-tommyfx-blue">FX</span>
            </h4>
            <p className="text-gray-300 mb-4">
              Where skincare meets perfection! Start with our powerful serums and get ready for the glow-up of a lifetime!
            </p>
            <div className="flex space-x-4">
              <a href="https://www.instagram.com/tommyfx.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-tommyfx-blue">
                <Instagram size={20} />
              </a>
              <a href="https://www.facebook.com/profile.php?id=61575684157555" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-tommyfx-blue">
                <Facebook size={20} />
              </a>
              <a href="https://www.tiktok.com/@tommyfx.pk" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-tommyfx-blue">
                {/* <Twitter size={20} /> */}
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                <path d="M19.321 5.562a5.124 5.124 0 0 1-.443-.258 6.228 6.228 0 0 1-1.137-.966c-.849-.85-1.302-1.963-1.302-3.212V.644h-3.19v14.041c0 2.547-2.067 4.614-4.614 4.614s-4.614-2.067-4.614-4.614 2.067-4.614 4.614-4.614c.254 0 .502.021.742.06v-3.233a7.832 7.832 0 0 0-.742-.036c-4.309 0-7.807 3.498-7.807 7.807s3.498 7.807 7.807 7.807 7.807-3.498 7.807-7.807V8.273c1.163.802 2.542 1.265 4.031 1.265v-3.193c-.97 0-1.878-.347-2.577-.935z"/>
                </svg>
              </a>
            
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xl mb-4 font-serif">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-300 hover:text-tommyfx-blue">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/categories" className="text-gray-300 hover:text-tommyfx-blue">
                  Shop All
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-tommyfx-blue">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-300 hover:text-tommyfx-blue">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Service */}
          <div>
            <h4 className="text-xl mb-4 font-serif">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                  Shipping & Returns
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                  FAQ
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Contact */}
          <div>
            <h4 className="text-xl mb-4 font-serif">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin size={20} className="mr-3 mt-1 text-tommyfx-blue flex-shrink-0" />
                <span className="text-gray-300">
                  Lahore , Punjab , Pakistan
                </span>
              </li>
              <li className="flex items-center">
                <Phone size={20} className="mr-3 text-tommyfx-blue flex-shrink-0" />
                <span className="text-gray-300">+92 (306) 714-5010</span>
              </li>
              <li className="flex items-center">
                <Mail size={20} className="mr-3 text-tommyfx-blue flex-shrink-0" />
                <span className="text-gray-300">tommyfx.pk@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center text-gray-400 text-sm">
          <p>© {new Date().getFullYear()} TommyFX Beauty. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;