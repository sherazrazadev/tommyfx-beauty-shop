
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

const About = () => {
  return (
    <div>
      {/* Page Header */}
      <section className="bg-gray-100 py-12">
        <div className="container-custom">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">About TommyFX</h1>
            <div className="flex items-center justify-center text-sm">
              <Link to="/" className="text-gray-500 hover:text-tommyfx-blue">Home</Link>
              <ChevronRight size={16} className="mx-2 text-gray-400" />
              <span className="text-gray-800">About Us</span>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <p className="text-gray-700 mb-4">
                TommyFX was founded in 2025 by beauty enthusiast Sheraz Raza and Aamir Ali. 
                What started as a passion for creating natural, effective skincare solutions for friends and 
                family quickly blossomed into a full-fledged beauty brand.
              </p>
              <p className="text-gray-700 mb-4">
                Our journey began with a simple mission: to create premium beauty products that enhance 
                your natural beauty without animal testing. We believe everyone 
                deserves to feel confident in their skin, which is why we formulate products that celebrate 
                your unique beauty.
              </p>
              <p className="text-gray-700">
                Today, TommyFX offers a comprehensive range of skincare, makeup, haircare, and 
                body products loved by customers worldwide. While we've grown, our commitment to quality, 
                sustainability, and ethical practices remains unchanged.
              </p>
            </div>
            <div className="relative">
              <div className="rounded-lg overflow-hidden shadow-xl">
                <img 
                  src="https://source.unsplash.com/wlxJ4idMTUk" 
                  alt="TommyFX founder" 
                  className="w-full h-auto" 
                />
              </div>
              <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-tommyfx-blue rounded-full opacity-20 z-0"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Core Values</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-tommyfx-blue bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-2xl text-tommyfx-blue font-serif">01</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Quality</h3>
              <p className="text-gray-700">
                We never compromise on quality, selecting only the finest ingredients and 
                rigorously testing each product to ensure effectiveness and safety.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-tommyfx-blue bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-2xl text-tommyfx-blue font-serif">02</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Sustainability</h3>
              <p className="text-gray-700">
                Our commitment to the planet means eco-friendly packaging, 
                sustainable sourcing, and minimizing our carbon footprint.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-tommyfx-blue bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-2xl text-tommyfx-blue font-serif">03</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p className="text-gray-700">
                We believe in honesty about what goes into our products, how they're made, 
                and the results you can expect.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="w-12 h-12 rounded-full bg-tommyfx-blue bg-opacity-20 flex items-center justify-center mb-4">
                <span className="text-2xl text-tommyfx-blue font-serif">04</span>
              </div>
              <h3 className="text-xl font-bold mb-3">Inclusivity</h3>
              <p className="text-gray-700">
                Beauty comes in all forms. Our products are designed to cater to diverse 
                skin tones, types, and beauty needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      {/* <section className="py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://source.unsplash.com/IF9TK5Uy-KI" 
                  alt="Amir Ali" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold">Aamir Ali</h3>
              <p className="text-tommyfx-blue mb-3">Founder & CEO</p>
              <p className="text-gray-700">
                Beauty enthusiast and skincare specialist with over 15 years of industry experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://source.unsplash.com/rDEOVtE7vOs" 
                  alt="Sarah Chen" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold">Sarah Chen</h3>
              <p className="text-tommyfx-blue mb-3">Head of Product Development</p>
              <p className="text-gray-700">
                Cosmetic chemist with a passion for creating innovative, effective formulations.
              </p>
            </div>

            <div className="text-center">
              <div className="rounded-lg overflow-hidden mb-4">
                <img 
                  src="https://source.unsplash.com/7YVZYZeITc8" 
                  alt="Michael Rodriguez" 
                  className="w-full aspect-square object-cover" 
                />
              </div>
              <h3 className="text-xl font-bold">Michael Rodriguez</h3>
              <p className="text-tommyfx-blue mb-3">Creative Director</p>
              <p className="text-gray-700">
                Visionary designer driving TommyFX's distinctive aesthetic and brand identity.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      {/* // <section className="py-16 bg-tommyfx-black text-white text-center">
      //   <div className="container-custom max-w-3xl">
      //     <h2 className="text-3xl font-bold mb-4">Join the TommyFX Family</h2>
      //     <p className="mb-8 text-gray-300">
      //       Experience the difference of beauty products crafted with care, quality, and 
      //       the perfect blend of science and nature.
      //     </p>
      //     <div className="flex flex-col sm:flex-row gap-4 justify-center">
      //       <Button asChild size="lg" className="bg-tommyfx-blue hover:bg-blue-600">
      //         <Link to="/categories">Shop Our Collection</Link>
      //       </Button>
      //       <Button asChild size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
      //         <Link to="/contact">Contact Us</Link>
      //       </Button>
      //     </div>
      //   </div>
      // </section> */}
    </div>
  );
};

export default About;
