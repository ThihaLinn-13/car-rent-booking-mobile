import { Car } from "@/types/car";
import { create } from "zustand";

interface CarState {
  isLoading: boolean;
  hasNext: boolean;
  page: number;
  cars: Car[];
  setCars: (cars: Car[]) => void;
  setHasNext: (hasNext: boolean) => void;
  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCarState = create<CarState>((set) => ({
  isLoading: false,
  hasNext: false,
  page: 0,
  cars: [],
  setCars: (cars: Car[]) => {
    set({ cars: cars });
  },
  setHasNext: (hasNext: boolean) => {
    set({ hasNext: hasNext });
  },
  setPage: (page: number) => {
    set({ page: page });
  },
  setIsLoading: (isLoading: boolean) => {
    set({ isLoading: isLoading });
  },
}));
