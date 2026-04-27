import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Client public (lecture vitrine + insertion commandes)
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Client admin (même clé anon — les RLS policies gèrent les accès)
// Pour l'admin on utilise le même client mais via les routes API
export const supabaseAdmin = createClient(supabaseUrl, supabaseAnonKey)