import { getCars } from "@/api/car_api";
import { Car } from "@/types/car";
import { ListResult } from "@/types/listResult";
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
  fetchCars: () => Promise<ListResult<Car>>;
}

export const useCarState = create<CarState>((set, get) => ({
  isLoading: false,
  hasNext: true,
  page: 0,
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

  fetchCars: async (): Promise<ListResult<Car>> => {
    const { page, isLoading, hasNext, cars } = get();
    if (isLoading || !hasNext) return { data: [], hasNext: false };

    set({ isLoading: true });
    try {
      const result = await getCars(page, 10);
      set({
        cars: page === 0 ? result.data : [...cars, ...result.data],
        hasNext: result.hasNext,
        page: page + 1,
        isLoading: false,
      });
      return result;
    } catch (error) {
      console.error('Failed to fetch cars:', error);
      set({ isLoading: false });
      return { data: [], hasNext: false };
    }
  },
}));
