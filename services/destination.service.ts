import api from '@/lib/axios';

/**
 * Destination Discovery Service Client
 */
export const destinationService = {
  // TODO: Add getDestinations endpoint integration
  getDestinations: async () => {
    const response = await api.get('/destinations');
    return response.data;
  },

  // TODO: Add getDestinationDetails endpoint integration
  getDestinationDetails: async (slug: string) => {
    const response = await api.get(`/destinations/${slug}`);
    return response.data;
  },
};
