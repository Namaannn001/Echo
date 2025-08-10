import { supabase } from '../lib/supabaseClient';
import type { Credentials } from '../types';

// The function now directly returns the entire object from Supabase
export async function signUpWithEmail(credentials: Credentials) {
  return supabase.auth.signUp(credentials);
}

// Do the same for the sign-in function for consistency
export async function signInWithEmail(credentials: Credentials) {
  return supabase.auth.signInWithPassword(credentials);
}

export async function signOut() {
  return supabase.auth.signOut();
}