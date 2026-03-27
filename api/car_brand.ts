import { superbase } from "@/lib/superbase";
import { CarBrand, CreateCarBrand } from "@/types/carBrand";
import { ListResult } from "@/types/listResult";

export const getCarBrands = async (
  page: number = 0,
  size: number = 4,
  allList: boolean = false,
): Promise<ListResult<CarBrand>> => {
  const from = page * size;
  const to = from + size - 1;
  const { data, error, count } = await superbase
    .from("car_brand")
    .select(`id,name,imageUrl:image_url`, { count: "exact" })
    .range(from, to)
    .order("created_at", { ascending: false });

  if (error) {
    alert(error.message);
    return { data: [], hasNext: false };
  }


  const hasNext = count ? to + 1 < count : false;

  const result = {
    data: data as unknown as CarBrand[],
    hasNext,
  };

  return result;
};

export const getAllCarBrands = async (): Promise<CarBrand[]> => {
  const { data, error } = await superbase
    .from("car_brand")
    .select(`id, name`)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all brands:", error.message);
    return [];
  }

  return data as CarBrand[];
};

export const addCarBrand = async (
  carBrand: CreateCarBrand,
): Promise<{ data: string | null }> => {
  const { data, error } = await superbase
    .from("car_brand")
    .insert([
      {
        name: carBrand.name,
        image_url: carBrand.imageUrl,
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
