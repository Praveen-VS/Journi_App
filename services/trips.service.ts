import api from '@/lib/axios';
import type { TripSummary } from '@/types';

/**
 * Trips Service Client
 */
export const tripsService = {
  // TODO: Add getTrips endpoint integration
  getTrips: async (): Promise<TripSummary[]> => {
    const response = await api.get('/trips');
    return response.data;
  },

  // TODO: Add getTripById endpoint integration
  getTripById: async (tripId: string): Promise<TripSummary> => {
    const response = await api.get(`/trips/${tripId}`);
    return response.data;
  },

  // TODO: Add createTrip endpoint integration
  createTrip: async (tripData: Partial<TripSummary>): Promise<TripSummary> => {
    const response = await api.post('/trips', tripData);
    return response.data;
  },
};
