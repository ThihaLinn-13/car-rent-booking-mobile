import { superbase } from "@/lib/superbase";
import { Car, CreateCar } from "@/types/car";
import { ListResult } from "@/types/listResult";
import { calcHasNext } from "@/util/pagination";

export const getCars = async (
  page: number,
  size: number,
): Promise<ListResult<Car>> => {
  const from = page * size;
  const to = from + size - 1;

  const {
    data: cars,
    error,
    count,
  } = await superbase
    .from("car")
    .select(
      "id,name,imageUrl:image_url,price,carNumber:car_number,brandId:brand_id",
      {
        count: "exact",
      },
    )
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching cars:", error.message);
    throw new Error(error.message);
  }

  const hasNext = count ? calcHasNext(page, size, count) : false;

  console.log("Fetched cars:", cars);

  const result = {
    data: cars as unknown as Car[],
    hasNext,
  };

  return result;
};

export const addCar = async (car: CreateCar): Promise<string | null> => {
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
    return null;
  }

  return data.id;
};
