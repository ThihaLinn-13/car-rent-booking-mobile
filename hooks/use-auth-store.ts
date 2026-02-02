import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

export type AuthData = {
  session?: Session | undefined;
  profile?: any | null;
  isLoading: boolean;
  isLoggedIn: boolean;
};

const useAuth = create<AuthData>(() => ({
  session: undefined,
  profile: undefined,
  isLoading: true,
  isLoggedIn: false,
}));
