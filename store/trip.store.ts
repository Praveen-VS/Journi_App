import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { TripSummary, ItineraryDay } from '@/types';
import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from '@/constants';

interface TripState {
  activeTripId: string | null;
  selectedTrip: TripSummary | null;
  customTrips: TripSummary[];
  customItineraries: Record<string, ItineraryDay[]>;
  setActiveTripId: (id: string | null) => void;
  setSelectedTrip: (trip: TripSummary | null) => void;
  addTrip: (trip: TripSummary, days?: ItineraryDay[]) => void;
  getTripById: (id: string) => TripSummary | undefined;
  getItineraryForTrip: (id: string) => ItineraryDay[];
}

export const useTripStore = create<TripState>()(
  devtools(
    persist(
      (set, get) => ({
        activeTripId: 'trip_kyoto_autumn',
        selectedTrip: MOCK_TRIPS[0],
        customTrips: MOCK_TRIPS,
        customItineraries: {
          'trip_kyoto_autumn': MOCK_ITINERARY_DAYS,
          'trip-kyoto-autumn': MOCK_ITINERARY_DAYS,
        },
        setActiveTripId: (id) => {
          const trip = get().customTrips.find((t) => t.id === id) || null;
          set({ activeTripId: id, selectedTrip: trip });
        },
        setSelectedTrip: (trip) => set({ selectedTrip: trip, activeTripId: trip?.id || null }),
        addTrip: (trip, days) =>
          set((state) => {
            const exists = state.customTrips.some((t) => t.id === trip.id);
            const updatedTrips = exists
              ? state.customTrips.map((t) => (t.id === trip.id ? trip : t))
              : [trip, ...state.customTrips];

            const updatedItineraries = { ...state.customItineraries };
            if (days && days.length > 0) {
              updatedItineraries[trip.id] = days;
            }

            return {
              customTrips: updatedTrips,
              customItineraries: updatedItineraries,
              selectedTrip: trip,
              activeTripId: trip.id,
            };
          }),
        getTripById: (id) => get().customTrips.find((t) => t.id === id),
        getItineraryForTrip: (id) => get().customItineraries[id] || MOCK_ITINERARY_DAYS,
      }),
      {
        name: 'journi-trip-storage',
      }
    )
  )
);
