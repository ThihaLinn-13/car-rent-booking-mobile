import { superbase } from "@/lib/superbase";
import { Car, CreateCar } from "@/types/car";
import { ListResult } from "@/types/listResult";

export const getCars = async (
  page: number = 0,
  size: number = 5,
): Promise<ListResult<Car>> => {
  const from = page * size;
  const to = from + size - 1;


  const { data, error, count } = await superbase
    .from("car")
    .select("id,name,imageUrl:image_url,price,carNumber:car_number", {
      count: "exact",
    })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error.message);
    throw new Error(error.message);
  }

  const hasNext = count ? to + 1 < count : false;

  const result = {
    data: data as unknown as Car[],
    hasNext,
  };

  return result;
};

export const addCar = async (
  car: CreateCar,
): Promise<{ data: string | null }> => {
  const { data, error } = await superbase
    .from("car")
    .insert([
      {
        name: car.name,
        image_url: car.imageUrl,
        brand_id: car.brandId,
        price: car.price,
        car_number: car.carNumber,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error adding car brand:", error.message);
    return { data: null };
  }

  return { data: data.id };
};
