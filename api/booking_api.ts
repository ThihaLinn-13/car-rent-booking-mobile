import { superbase } from "@/lib/superbase";
import { AddBooking, Booking } from "@/types/booking";
import { ListResult } from "@/types/listResult";

export const getBookedDayByMonth = async (
  month: number,
  year: number,
  carId: string,
): Promise<Booking[]> => {
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 0, 23, 59, 59);

  const firstDayFull = start.toISOString();
  const lastDayFull = end.toISOString();

  // For the clamping logic later
  const firstDayStr = firstDayFull.split("T")[0];
  const lastDayStr = lastDayFull.split("T")[0];

  const { data, error } = await superbase
    .from("booking")
    .select("id, start_date, end_date, created_at, car_id, user_id")
    .eq("car_id", carId)
    .or(
      `and(start_date.gte.${firstDayFull},start_date.lte.${lastDayFull}),and(end_date.gte.${firstDayFull},end_date.lte.${lastDayFull})`,
    )
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Supabase Error:", error.message);
    return [];
  }

  return (data || []).map((booking) => ({
    id: booking.id,
    carId: booking.car_id,
    userId: booking.user_id,
    // Logic Preserved: Clamp dates to the month boundaries
    startDate:
      booking.start_date < firstDayStr ? firstDayStr : booking.start_date,
    endDate: booking.end_date > lastDayStr ? lastDayStr : booking.end_date,
    createdAt: booking.created_at,
  })) as Booking[];
};

export const getActivitiesByUserId = async (
  page: number = 0,
  size: number = 10,
  userId: string,
  roles: string[],
  month: number,
  year: number,
): Promise<ListResult<Booking>> => {
  const from = page * size;
  const to = from + size - 1;

  const pad = (n: number) => n.toString().padStart(2, "0");
  const firstDay = `${year}-${pad(month)}-01`;
  const lastDayDate = new Date(year, month, 0);
  const lastDay = `${year}-${pad(month)}-${pad(lastDayDate.getDate())}`;

  const firstDayFull = `${firstDay}T00:00:00`;
  const lastDayFull = `${lastDay}T23:59:59`;

  let query = superbase
    .from("booking")
    .select(`id, start_date, end_date, created_at, car_id, user_id`, { count: "exact" });

  if (roles.length === 0) {
    query = query.eq("user_id", userId);
  }

  query = query.or(
    `and(start_date.gte.${firstDayFull},start_date.lte.${lastDayFull}),and(end_date.gte.${firstDayFull},end_date.lte.${lastDayFull})`,
  );

  const { data, error, count } = await query
    .range(from, to)
    .order("start_date", { ascending: true });

  if (error) {
    console.error("Supabase Error:", error.message);
    return { data: [], hasNext: false };
  }

  return {
    data: (data || []).map((b: any) => ({
      id: b.id,
      carId: b.car_id ?? '',
      userId: b.user_id ?? '',
      startDate: b.start_date,
      endDate: b.end_date,
      createdAt: b.created_at,
    })) as Booking[],
    hasNext: count ? to + 1 < count : false,
  };
};

export const addBooking = async (
  booking: AddBooking,
): Promise<number | null> => {
  const { data, error } = await superbase
    .from("booking")
    .insert([
      {
        car_id: booking.carId,
        user_id: booking.userId,
        start_date: booking.startDate,
        end_date: booking.endDate,
      },
    ])
    .select("id")
    .single();

  if (error) {
    console.error("Error adding booking:", error.message);
    return null;
  }

  return data.id;
};
