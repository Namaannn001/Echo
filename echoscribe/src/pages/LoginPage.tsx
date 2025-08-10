import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { signInWithEmail } from '../services/authService';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // This is the updated logic, similar to the SignUp page
      const { data, error } = await signInWithEmail({ email, password });

      if (error) {
        throw error; // Throw the error to be caught by the catch block
      }
      
      // Check if the user object and session exist
      if (data.user && data.session) {
        toast.success('Login successful!');
        navigate('/dashboard'); // Redirect to dashboard on success
      }
    } catch (error: any) {
      toast.error(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="p-8 border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Welcome Back</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" id="email" type="email" 
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required 
          />
          <Input 
            label="Password" id="password" type="password" 
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required 
          />
          <Button type="submit" variant="primary" className="w-full !py-3" isLoading={isLoading}>
            Login
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/signup" className="font-medium text-purple-400 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}