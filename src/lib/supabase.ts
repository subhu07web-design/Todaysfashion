import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase Configuration Error: VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY is missing in Settings.');
} else if (supabaseAnonKey.startsWith('sb_publishable_')) {
  console.warn('Supabase Configuration Warning: You are using a key that looks like a STRIPE key. If Supabase fails, please use the "anon public" key from Supabase settings.');
}

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
