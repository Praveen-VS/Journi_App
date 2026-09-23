import api from '@/lib/axios';

/**
 * Weather Service Client
 */
export const weatherService = {
  // TODO: Add getWeatherByDestination endpoint integration
  getWeather: async (destination: string) => {
    const response = await api.get(`/weather`, {
      params: { destination },
    });
    return response.data;
  },
};
