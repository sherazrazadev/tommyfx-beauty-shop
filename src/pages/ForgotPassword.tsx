
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { CheckCircle2 } from 'lucide-react';

const ForgotPassword = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
  };

  return (
    <div className="bg-gray-50 py-16 min-h-[calc(100vh-10rem)]">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          {!isSubmitted ? (
            <>
              <h1 className="text-2xl font-bold mb-2 text-center">Forgot Your Password?</h1>
              <p className="text-center text-gray-600 mb-6">
                Enter your email and we'll send you instructions to reset your password.
              </p>
              
              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label htmlFor="email" className="block mb-2 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                    required
                  />
                </div>
                
                <Button type="submit" className="btn-primary w-full mb-4">
                  Send Reset Instructions
                </Button>
                
                <p className="text-center">
                  <Link to="/login" className="text-tommyfx-blue hover:underline">
                    Back to Login
                  </Link>
                </p>
              </form>
            </>
          ) : (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-2">Check Your Email</h2>
              <p className="mb-6 text-gray-600">
                We've sent password reset instructions to:
                <br />
                <span className="font-medium">{email}</span>
              </p>
              <div className="space-y-3">
                <Button asChild variant="outline" className="btn-outline w-full">
                  <Link to="/login">Back to Login</Link>
                </Button>
                <Button 
                  onClick={() => setIsSubmitted(false)} 
                  variant="ghost" 
                  className="w-full"
                >
                  Try another email
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
