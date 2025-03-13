import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with hardcoded values for the frontend
const supabaseUrl = 'https://uqdolredkukdkoolnubw.supabase.co';
const supabaseKey =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVxZG9scmVka3VrZGtvb2xudWJ3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4MDc5NjEsImV4cCI6MjA1NzM4Mzk2MX0.IExrd80O0Tx6OrIS6XVaQHw8XQlpLNjEtdoGWsi7-Yg';

export const supabase = createClient(supabaseUrl, supabaseKey);
