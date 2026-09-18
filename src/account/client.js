import {createClient} from '@supabase/supabase-js';
const url=import.meta.env.VITE_SUPABASE_URL;
const key=import.meta.env.VITE_SUPABASE_ANON_KEY;
export const passwordFlow = new URLSearchParams(location.search).get('account')==='setup' || /type=(recovery|invite)/.test(location.hash);
export const authCallbackError = new URLSearchParams(location.hash.slice(1)).get('error_description');
export const supabase = url && key ? createClient(url,key,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}}) : null;
export const callbackURL = () => `${location.origin}/?account=setup`;
