import { superbase } from "@/lib/superbase";
import { CarCategory } from "@/types/carCategory";
import { ListResult } from "@/types/listResult";

export const getCarCategories = async (
  page: number = 0,
  size: number = 4,
): Promise<ListResult<CarCategory>> => {
  const from = page * size;
  const to = from + size - 1;
  const { data, error, count } = await superbase
    .from("car_categories")
    .select(`id,name`, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    return { data: [], hasNext: false };
  }

  const hasNext = count ? to + 1 < count : false;

  const result = {
    data: data as unknown as CarCategory[],
    hasNext,
  };

  return result;
};
