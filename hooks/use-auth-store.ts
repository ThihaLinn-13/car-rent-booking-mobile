import { removeData } from "@/lib/secureStore";
import { GoogleUser } from "@/types/auth";
import { create } from "zustand";

interface AuthState {
  user: GoogleUser | null;
  setUser: (user: GoogleUser) => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuth = create<AuthState>((set) => ({
  user: null,

  setUser: async (user) => {
    set({ user });
  },

  logout: async () => {
    await removeData("userData");
    set({ user: null });
  },
}));
