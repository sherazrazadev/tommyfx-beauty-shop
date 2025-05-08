
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/components/ui/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn, user } = useAuth();
  const navigate = useNavigate();

  // If user is already logged in, redirect to home page
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password) || {};
      if (error) {
        toast({
          title: "Login failed",
          description: error.message,
          variant: "destructive"
        });
      } else {
        toast({
          title: "Login successful",
          description: "Welcome back!",
        });
        navigate('/');
      }
    } catch (err: any) {
      toast({
        title: "Login failed",
        description: err.message || "An error occurred while logging in",
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
          <h1 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h1>
          
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
              <div className="flex justify-between mb-2">
                <label htmlFor="password" className="font-medium">
                  Password
                </label>
                <Link to="/forgot-password" className="text-sm text-tommyfx-blue hover:underline">
                  Forgot Password?
                </Link>
              </div>
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
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-gray-600">Remember me</span>
              </label>
            </div>
            
            <Button 
              type="submit" 
              className="btn-primary w-full mb-4"
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </Button>
            
            <p className="text-center">
              Don't have an account?{' '}
              <Link to="/signup" className="text-tommyfx-blue hover:underline">
                Sign Up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
