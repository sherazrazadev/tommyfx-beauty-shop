
import React from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { Toaster } from "@/components/ui/toaster";
import FloatingActions from '../ui/FloatingActions';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <Footer />
      <FloatingActions />

      <Toaster />

    </div>
  );
};

export default Layout;
