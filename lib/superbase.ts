import { supabaseAnonKey, supabaseUrl } from "@/config/config";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { createClient } from "@supabase/supabase-js";
import "expo-sqlite/localStorage/install";

import "react-native-url-polyfill/auto";

export const superbase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
