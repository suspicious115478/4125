import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://wbtslpyulsskgdtkknaf.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndidHNscHl1bHNza2dkdGtrbmFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2NDc0MDgsImV4cCI6MjA3OTIyMzQwOH0.BcvA4VFPybxQvQRNpt1e0NvDNATrhddx5RgvWAYgQM0';

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
