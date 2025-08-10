import { create } from 'zustand';
import type { Session } from '@supabase/supabase-js';

// Define the shape of our store's state
interface AuthState {
  session: Session | null;
  isAuthenticated: boolean;
  // The setter now only needs the session, it will figure out isAuthenticated itself
  setSession: (session: Session | null) => void; 
}

// Create the store with Zustand
export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  isAuthenticated: false,
  setSession: (session) => set(() => ({ 
    session, 
    isAuthenticated: !!session // This is a clean way to set the boolean
  })),
}));