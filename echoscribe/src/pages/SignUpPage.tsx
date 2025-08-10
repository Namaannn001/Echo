import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import toast from 'react-hot-toast';
import { signUpWithEmail } from '../services/authService';

export function SignUpPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      // This line will now work correctly because signUpWithEmail returns { data, error }
      const { data, error } = await signUpWithEmail({ email, password });
      
      if (error) {
        throw error;
      }
      
      if (data.user) {
        toast.success('Success! Please check your email to confirm your account.', {
          duration: 6000,
        });
        navigate('/login');
      } else {
        // This case handles scenarios where the user exists but confirmation is pending
        toast.error('Could not create account. This email may already be in use.');
      }

    } catch (error: any) {
      toast.error(error.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20">
      <div className="p-8 border border-gray-700 rounded-lg bg-gray-800 shadow-lg">
        <h2 className="text-3xl font-bold text-center text-white mb-6">Create an Account</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input 
            label="Email Address" id="email" type="email" 
            value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com" required 
          />
          <Input 
            label="Password" id="password" type="password" 
            value={password} onChange={(e) => setPassword(e.target.value)}
            placeholder="Choose a strong password" required 
            minLength={6}
          />
          <Button type="submit" variant="primary" className="w-full !py-3" isLoading={isLoading}>
            Sign Up
          </Button>
        </form>
        <p className="text-center text-sm text-gray-400 mt-6">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-purple-400 hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}