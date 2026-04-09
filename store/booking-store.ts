import { addBooking, getBookedDayByMonth } from "@/api/booking_api";
import { AddBooking, Booking } from "@/types/booking";
import { Car } from "@/types/car";
import { create } from "zustand";

interface BookingState {
  activities: Booking[];
  isLoading: boolean;
  selectedCar:Car | null;
  selectedMonth: number;
  selectedYear: number;
  selectedStartDate: string | null;
  selectedEndDate: string | null;
  bookedDates: Record<string, any>;

  setSelectedCardId: (car:Car) => void;
  getBookedDayByMonth: () => Promise<void>;
  setPeriod: (month: number, year: number) => void;
  setSelectedStartDate: (date: string | null) => void;
  setSelectedEndDate: (date: string | null) => void;
  refreshMarkedDates: () => void;
  addBooking:(booking:AddBooking) => Promise<number | null>;
}

export const useBookingStore = create<BookingState>((set, get) => ({
  activities: [],
  isLoading: false,
  selectedCar:null,
  selectedMonth: new Date().getMonth() + 1,
  selectedYear: new Date().getFullYear(),
  bookedDates: {},
  selectedEndDate: null,
  selectedStartDate: null,
  
  setSelectedCardId:(car) => set({selectedCar:car}),

  setSelectedStartDate: (date) => set({ selectedStartDate: date }),
  setSelectedEndDate: (date) => set({ selectedEndDate: date }),

  setPeriod: (month, year) => set({ selectedMonth: month, selectedYear: year }),

  getBookedDayByMonth: async () => {
    const { selectedMonth, selectedYear,selectedCar } = get();
    set({ isLoading: true });

    try {

      const result = await getBookedDayByMonth( selectedMonth, selectedYear,selectedCar?.id!);

      

      const marked = result.reduce((acc: any, booking:Booking) => {
        // mark every day in the booked range with a red dot
        let curr = new Date(booking.startDate);
        const last = new Date(booking.endDate);
        while (curr <= last) {
          const ds = curr.toISOString().split('T')[0];
          acc[ds] = { marked: true, dotColor: '#BC3433' };
          curr.setDate(curr.getDate() + 1);
        }
        return acc;
      }, {});


      set({ activities: result, bookedDates: marked, isLoading: false });
    } catch (error) {
      console.error("Failed to fetch bookings:", error);
      set({ isLoading: false });
    }
  },
  refreshMarkedDates: () => {
    const state = get();
    const activities = state.activities;
    const selectedStartDate = state.selectedStartDate
    const selectedEndDate = state.selectedEndDate
    const marked: Record<string, any> = {};

    // Mark ALL dates in booked ranges with red dots
    activities.forEach((booking) => {
      let curr = new Date(booking.startDate);
      const last = new Date(booking.endDate);
      while (curr <= last) {
        const ds = curr.toISOString().split('T')[0];
        marked[ds] = {
          marked: true,
          dotColor: "#BC3433", 
        };
        curr.setDate(curr.getDate() + 1);
      }
    });

    // This layer ignores activities and just draws the blue bar
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

  addBooking:async(booking:AddBooking) => {
    const bookingId = await addBooking(booking);
    if (bookingId) {
      // Refresh booked dates after successful booking
      await get().getBookedDayByMonth();
    }
    return bookingId;
  }

}));
