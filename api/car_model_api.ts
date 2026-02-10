import { superbase } from "@/lib/superbase";
import { Car } from "@/types/car";
import { ListResult } from "@/types/listResult";

export const getCarModels = async (
  page: number = 0,
  size: number = 5,
): Promise<ListResult<Car>> => {
  const from = page * size;
  const to = from + size - 1;

  const { data, error, count } = await superbase
    .from("car_models")
    .select(
      `id,car_name,car_number,rent_price_per_day,is_available,car_photo`,
      { count: "exact" },
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return { data: [], hasNext: false };
  }

  const hasNext = count ? to + 1 < count : false;

  const result = {
    data: data as unknown as Car[],
    hasNext,
  };

  return result;
};
