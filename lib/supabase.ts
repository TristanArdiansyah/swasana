// lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl || "https://ukcxwccpzpjnrskjwifd.supabase.co", supabaseAnonKey || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVrY3h3Y2NwenBqbnJza2p3aWZkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDIyMzE4NzgsImV4cCI6MjA1NzgwNzg3OH0._-wIwBA8lmTGU37NECqkcF6TQxb_ycEfMGhqhk1W-Kg");
