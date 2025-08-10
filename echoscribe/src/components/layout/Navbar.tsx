import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Button } from '../ui/Button';
import { BookMarked } from 'lucide-react';
import { useAuthStore } from '../../store/useAuthStore';
import { signOut } from '../../services/authService';
import toast from 'react-hot-toast';

export function Navbar() {
  // This line correctly gets the boolean state from the store.
  // The red line you saw here was a symptom of the store's incorrect typing.
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('You have been logged out.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <nav className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to={isAuthenticated ? "/dashboard" : "/"} className="flex items-center space-x-2 text-2xl font-bold text-white">
              <BookMarked className="w-7 h-7 text-purple-400"/>
              <h1>Echo<span className="text-purple-400">Scribe</span></h1>
            </Link>
          </div>
          <div className="flex items-center space-x-2">
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard">
                  {({ isActive }) => (
                    <Button variant={isActive ? 'primary' : 'secondary'}>Dashboard</Button>
                  )}
                </NavLink>
                <Button variant='destructive' onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <NavLink to="/login">
                  <Button variant="primary">Login / Sign Up</Button>
              </NavLink>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}