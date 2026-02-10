import { CarCategory } from "@/types/carCategory";
import { create } from "zustand";

interface CarCategoryState {
  isLoading: boolean;
  hasNext: boolean;
  page: number;
  carCategories: CarCategory[];
  setCarCategories: (carCategories: CarCategory[]) => void;
  setHasNext: (hasNext: boolean) => void;
  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useCarCateogryStore = create<CarCategoryState>((set) => ({
  isLoading: false,
  hasNext: false,
  page: 0,
  carCategories: [],
  setCarCategories: (carCategories: CarCategory[]) => {
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
