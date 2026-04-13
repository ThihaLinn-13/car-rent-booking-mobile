import { getCars } from "@/api/car_api";
import { Car } from "@/types/car";
import { create } from "zustand";

interface CarState {
  isLoading: boolean;
  hasNext: boolean;
  page: number;
  pageSize: number;
  cars: Car[];
  setCars: (cars: Car[]) => void;
  setHasNext: (hasNext: boolean) => void;
  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  getCars: () => Promise<void>;
}

export const useCarState = create<CarState>((set, get) => ({
  isLoading: false,
  hasNext: true,
  page: 0,
  pageSize: 5,
  cars: [],

  setCars: (cars: Car[]) => {
    set({ cars });
  },

  setHasNext: (hasNext: boolean) => {
    set({ hasNext });
  },

  setPage: (page: number) => {
    set({ page });
  },

  setIsLoading: (isLoading: boolean) => {
    set({ isLoading });
  },

  getCars: async (): Promise<void> => {
    const { page, isLoading, hasNext, cars, pageSize } = get();
    if (isLoading || !hasNext) return;

    set({ isLoading: true });
    try {
      const result = await getCars(page, pageSize);
      set({
        cars: page === 0 ? result.data : [...cars, ...result.data],
        hasNext: result.hasNext,
        page: page + 1,
        isLoading: false,
      });
    } catch (error) {
      console.error("Failed to fetch cars:", error);
      set({ isLoading: false });
      return;
    }
  },
}));
