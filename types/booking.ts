export type Booking = {
  id: string;
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
  createdAt: string;
};

export type AddBooking = {
  carId: string;
  userId: string;
  startDate: string;
  endDate: string;
};
