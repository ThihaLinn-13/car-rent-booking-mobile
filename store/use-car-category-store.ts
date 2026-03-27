import { CarBrand } from "@/types/carBrand";
import { create } from "zustand";

interface CarBrandState {
  isLoading: boolean;
  hasNext: boolean;
  page: number;
  carCategories: CarBrand[];
  setCarCategories: (carCategories: CarBrand[]) => void;
  setHasNext: (hasNext: boolean) => void;
  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCarCateogryStore = create<CarBrandState>((set) => ({
  isLoading: false,
  hasNext: true,
  page: 0,
  carCategories: [],
  setCarCategories: (carCategories: CarBrand[]) => {
    set({ carCategories: carCategories });
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
