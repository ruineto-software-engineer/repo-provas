import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tovubqodxmyonrsuxrct.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvdnVicW9keG15b25yc3V4cmN0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2NTE2MDUxMzcsImV4cCI6MTk2NzE4MTEzN30.jTAVHBHMhoMhvmx6U5nfjoP23tzBktpI5rzHVblx6Zk';
const token = 'sbp_cda4c91aaa86f4a72a1cb0fa5f2b005b1bba9aa3';

const supabase = createClient(supabaseUrl, supabaseAnonKey);
const { user, error } = supabase.auth.setAuth(token);

console.log("user: ", user);
console.log("error: ", error);

export default supabase;