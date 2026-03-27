export type Car = {
  id: string;
  name: string;
  carNumber: string;

  price: string;
  imageUrl: string;
};

export type CreateCar = {
  name: string;
  imageUrl: string;
  carNumber: string;
  brandId: string;
  price: number;
};
