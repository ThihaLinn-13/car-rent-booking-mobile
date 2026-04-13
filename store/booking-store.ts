import { addBooking, getBookedDayByMonth } from "@/api/booking_api";
import { AddBooking, Booking } from "@/types/booking";
import { Car } from "@/types/car";
import { create } from "zustand";

interface BookingState {
  activities: Booking[];
  isLoading: boolean;
  selectedCar: Car | null;
  selectedMonth: number;
  selectedYear: number;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  bookedDates: Record<string, any>;
  selectedDates: Record<string, any>;

  getBookedDayByMonth: () => Promise<void>;
  setSelectedCar: (car: Car | null) => void;
  setPeriod: (month: number, year: number) => void;
  setSelectedStartDate: (date: string | null) => void;
  setSelectedEndDate: (date: string | null) => void;
  refreshMarkedDates: () => void;
  addBooking: (booking: AddBooking) => Promise<void>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  activities: [],
  isLoading: false,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  bookedDates: {},
  selectedEndDate: null,
  selectedStartDate: null,
  selectedCar: null,

  setSelectedStartDate: (date) => set({ selectedStartDate: date }),
  setSelectedEndDate: (date) => set({ selectedEndDate: date }),

  setPeriod: (month, year) => set({ selectedMonth: month, selectedYear: year }),

  getBookedDayByMonth: async () => {
    const { selectedMonth, selectedYear, selectedCar } = get();
    set({ isLoading: true });

    try {
      const result = await getBookedDayByMonth(
        selectedMonth,
        selectedYear,
        selectedCar?.id || "",
      );

      const marked = result.reduce((acc: any, booking) => {
        acc[booking.startDate] = {
          marked: true,
          dotColor: "#3b82f6",
          activeOpacity: 0,
        };
        return acc;
      }, {});

      set({ activities: result, bookedDates: marked, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      set({ isLoading: false });
    }
  },
  refreshMarkedDates: () => {
    const { activities, selectedStartDate, selectedEndDate } = get();
    const marked: Record<string, any> = {};

    activities.forEach((booking) => {
      marked[booking.startDate] = {
        marked: true,
        dotColor: "#9CA3AF",
      };
    });

    if (selectedStartDate) {
      marked[selectedStartDate] = {
        ...marked[selectedStartDate],
        startingDay: true,
        endingDay: !selectedEndDate,
        color: "#3b82f6",
        textColor: "white",
      };

      if (selectedEndDate) {
        marked[selectedEndDate] = {
          ...marked[selectedEndDate],
          endingDay: true,
          color: "#3b82f6",
          textColor: "white",
        };

        let curr = new Date(selectedStartDate);
        let last = new Date(selectedEndDate);

        curr.setDate(curr.getDate() + 1);
        while (curr < last) {
          const ds = curr.toISOString().split("T")[0];
          marked[ds] = {
            ...marked[ds],
            color: "#3b82f6",
            textColor: "white",
          };
          curr.setDate(curr.getDate() + 1);
        }
      }
    }

    set({ bookedDates: marked });
  },
  selectedDates: () => {},
  addBooking: async (booking) => {
    try {
      const newId = await addBooking(booking);
      if (newId) {
        await get().getBookedDayByMonth();
      }
    } catch (error) {
      console.error("Failed to add booking:", error);
    }
  },
  setSelectedCar: (car) => set({ selectedCar: car }),
}));
