
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signUp, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure both passwords match",
        variant: "destructive"
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signUp(email, password) || {};
      if (error) {
        toast({
          title: "Signup failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Signup successful",
          description: "Please check your email to verify your account",
        });
        navigate('/login');
      }
    } catch (err: any) {
      toast({
        title: "Signup failed",
        description: err.message || "An error occurred during signup",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-50 py-16 min-h-[calc(100vh-10rem)]">
      <div className="container-custom">
        <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-sm">
          <h1 className="text-2xl font-bold mb-6 text-center">Create an Account</h1>
          
          <form onSubmit={handleSubmit}>            
            <div className="mb-4">
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
            
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 font-medium">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                required
              />
            </div>
            
            <div className="mb-6">
              <label htmlFor="confirmPassword" className="block mb-2 font-medium">
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-tommyfx-blue"
                required
              />
            </div>
            
            <div className="mb-6">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" required />
                <span className="text-gray-600">
                  I agree to the{' '}
                  <Link to="/terms" className="text-tommyfx-blue hover:underline">
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link to="/privacy" className="text-tommyfx-blue hover:underline">
                    Privacy Policy
                  </Link>
                </span>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="btn-primary w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
            
            <p className="text-center">
              Already have an account?{' '}
              <Link to="/login" className="text-tommyfx-blue hover:underline">
                Login
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
