import { create } from "zustand";
import type { Player } from "./types";

interface AuthState {
  role: "visitor" | "player" | "admin";
  player: Player | null;
  setAdmin: () => void;
  setPlayer: (player: Player) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  role: "visitor",
  player: null,
  setAdmin: () => set({ role: "admin", player: null }),
  setPlayer: (player: Player) => set({ role: "player", player }),
  logout: () => set({ role: "visitor", player: null }),
}));
