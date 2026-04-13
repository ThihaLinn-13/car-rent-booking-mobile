import { getCarBrands } from "@/api/car_brand";
import { CarBrand } from "@/types/carBrand";
import { create } from "zustand";

interface CarBrandState {
  isLoading: boolean;
  hasNext: boolean;
  page: number;
  pageSize: number;
  carCategories: CarBrand[];
  setCarCategories: (carCategories: CarBrand[]) => void;
  setHasNext: (hasNext: boolean) => void;
  setPage: (page: number) => void;
  setIsLoading: (isLoading: boolean) => void;
  getCarBrands: () => Promise<void>;
}

export const useCarCateogryStore = create<CarBrandState>((set, get) => ({
  isLoading: false,
  hasNext: true,
  page: 0,
  pageSize: 5,
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
  getCarBrands: async () => {
    const { page, isLoading, hasNext, carCategories } = get();
    if (isLoading || !hasNext) return;
    set({ isLoading: true });

    try {
      const result = await getCarBrands(page, 10);
      set({
        carCategories:
          page === 0 ? result.data : [...carCategories, ...result.data],
        hasNext: result.hasNext,
        page: page + 1,
        isLoading: false,
      });
      return;
    } catch (error) {
      console.error("Failed to fetch car brands:", error);
      set({ isLoading: false });
      return;
    }
  },
}));
