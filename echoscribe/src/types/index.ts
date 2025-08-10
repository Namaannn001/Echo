// A simplified User type. Supabase provides a more detailed one.
export interface UserProfile {
  id: string;
  username: string;
  avatar_url?: string;
}

export interface Story {
  id: string;
  created_at: string;
  title: string;
  premise: string;
  genre: string;
  author_id: string;
  participants: UserProfile[]; // Simplified for UI
}

export interface Turn {
  id: string;
  created_at: string;
  author: UserProfile;
  text: string;
  is_ai: boolean;
  image_url?: string;
}
export interface Credentials {
  email: string;
  password: string;
}