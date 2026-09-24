import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { SavedPlace, Destination } from '@/types';
import { MOCK_SAVED_PLACES } from '@/constants';
import {
  fetchSavedPlaces,
  toggleSaveDestination,
} from '@/services/saved.service';

interface SavedState {
  savedPlaces: SavedPlace[];
  isLoading: boolean;
  loadSavedPlaces: () => Promise<void>;
  toggleFavorite: (destination: Destination) => Promise<boolean>;
  removePlace: (id: string) => void;
  isSaved: (idOrName: string) => boolean;
}

export const useSavedStore = create<SavedState>()(
  devtools(
    persist(
      (set, get) => ({
        savedPlaces: MOCK_SAVED_PLACES,
        isLoading: false,

        loadSavedPlaces: async () => {
          set({ isLoading: true });
          try {
            const places = await fetchSavedPlaces();
            set({ savedPlaces: places, isLoading: false });
          } catch {
            set({ isLoading: false });
          }
        },

        toggleFavorite: async (destination: Destination) => {
          const { isSaved, updatedPlaces } = await toggleSaveDestination(destination);
          set({ savedPlaces: updatedPlaces });
          return isSaved;
        },

        removePlace: (id: string) => {
          const updated = get().savedPlaces.filter((p) => p.id !== id);
          set({ savedPlaces: updated });
        },

        isSaved: (idOrName: string) => {
          return get().savedPlaces.some(
            (p) =>
              p.id === idOrName ||
              p.name.toLowerCase() === idOrName.toLowerCase() ||
              p.destination.toLowerCase() === idOrName.toLowerCase()
          );
        },
      }),
      {
        name: 'journi-saved-storage',
      }
    )
  )
);
