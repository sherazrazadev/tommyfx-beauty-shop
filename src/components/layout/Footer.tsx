
import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="bg-tommyfx-black text-white pt-16 pb-8">
      <div className="container-custom">
        {/* Newsletter Section */}
        <div className="mb-12 text-center">
          <h3 className="text-2xl mb-4">Stay Updated</h3>
          <p className="text-gray-300 mb-6 max-w-lg mx-auto">
            Subscribe to our newsletter for exclusive offers, beauty tips, and new product releases.
          </p>
          <div className="flex flex-col sm:flex-row max-w-md mx-auto gap-3">
            <input
              type="email"
              placeholder="Your email address"
              className="flex-grow p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue text-tommyfx-black"
            />
            <Button className="bg-tommyfx-blue hover:bg-blue-600 transition-colors">
              Subscribe
            </Button>
          </div>
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
              <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                <Instagram size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                <Facebook size={20} />
              </a>
              <a href="#" className="text-gray-300 hover:text-tommyfx-blue">
                <Twitter size={20} />
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
