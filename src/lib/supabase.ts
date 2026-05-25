import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export interface WebsiteData {
  id: string;
  name: string;
  url: string;
  icon: string;
  position: number;
  type: string;
  group_id: string;
  created_at?: string;
  updated_at?: string;
}

export interface GroupData {
  id: string;
  name: string;
  position: number;
  created_at?: string;
  updated_at?: string;
}
