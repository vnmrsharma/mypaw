import { createClient } from '@supabase/supabase-js';
import type { User } from '@supabase/supabase-js';
import type { Pet, ChatMessage, DietPlan } from '../types';

// Replace with your actual Supabase URL and anon key
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'your-supabase-url';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string): Promise<User | null> => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;
    return data.user;
  } catch (error) {
    console.error('Error signing in:', error);
    throw error;
  }
};

export const signOut = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  try {
    // Add timeout to prevent hanging
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Auth timeout')), 3000);
    });

    const authPromise = supabase.auth.getUser();
    
    const { data: { user } } = await Promise.race([authPromise, timeoutPromise]);
    return user;
  } catch (error) {
    if (error instanceof Error && error.message === 'Auth timeout') {
      console.warn('Auth request timed out');
    } else {
      console.error('Error getting current user:', error);
    }
    return null;
  }
};

export const uploadPetImage = async (file: File, petId: string): Promise<string | null> => {
  try {
    const fileExt = file.name.split('.').pop();
    const fileName = `${petId}-${Date.now()}.${fileExt}`;
    const filePath = `pets/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from('pet-images')
      .upload(filePath, file);

    if (uploadError) throw uploadError;

    const { data } = supabase.storage
      .from('pet-images')
      .getPublicUrl(filePath);

    return data.publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    return null;
  }
};

export const savePet = async (pet: Omit<Pet, 'id' | 'created_at'>): Promise<Pet | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('pets')
      .insert([{ ...pet, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving pet:', error);
    return null;
  }
};

export const getPets = async (): Promise<Pet[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      console.log('No user found when fetching pets');
      return [];
    }

    console.log('Fetching pets for user:', user.id);

    const { data, error } = await supabase
      .from('pets')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;
    console.log('Pets query result:', data?.length || 0);
    return data || [];
  } catch (error) {
    console.error('Error fetching pets:', error);
    return [];
  }
};

export const saveChatMessage = async (message: Omit<ChatMessage, 'id' | 'created_at'>): Promise<ChatMessage | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('chat_messages')
      .insert([{ ...message, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving chat message:', error);
    return null;
  }
};

export const getChatMessages = async (petId: string): Promise<ChatMessage[]> => {
  try {
    const user = await getCurrentUser();
    if (!user) return [];

    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('pet_id', petId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching chat messages:', error);
    return [];
  }
};

export const saveDietPlan = async (dietPlan: Omit<DietPlan, 'id' | 'created_at'>): Promise<DietPlan | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('diet_plans')
      .insert([{ ...dietPlan, user_id: user.id }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error saving diet plan:', error);
    return null;
  }
};

export const getDietPlan = async (petId: string): Promise<DietPlan | null> => {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('diet_plans')
      .select('*')
      .eq('pet_id', petId)
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (error) throw error;
    return data && data.length > 0 ? data[0] : null;
  } catch (error) {
    console.error('Error fetching diet plan:', error);
    return null;
  }
};