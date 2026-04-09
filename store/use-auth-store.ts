import { removeData } from "@/lib/secureStore";
import { User } from "@/types/user";
import { create } from "zustand";

interface AuthState {
  user: User | null;
  setUser: (user: User | null) => Promise<void>;
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
