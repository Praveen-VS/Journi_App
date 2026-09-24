import { getSupabaseBrowserClient, isSupabaseConfigured } from '@/lib/supabase/client';
import type { SavedPlace, Destination } from '@/types';
import { MOCK_SAVED_PLACES } from '@/constants';

const LOCAL_STORAGE_KEY = 'journi_saved_places_v1';

export function getLocalSavedPlaces(): SavedPlace[] {
  if (typeof window === 'undefined') return MOCK_SAVED_PLACES;
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to parse saved places from localStorage:', err);
  }
  return MOCK_SAVED_PLACES;
}

export function setLocalSavedPlaces(places: SavedPlace[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(places));
  } catch (err) {
    console.warn('Failed to save places to localStorage:', err);
  }
}

export async function fetchSavedPlaces(): Promise<SavedPlace[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return getLocalSavedPlaces();
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return getLocalSavedPlaces();
    }

    const { data, error } = await supabase
      .from('saved_places')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) {
      return getLocalSavedPlaces();
    }

    return (data as any[]).map((row: any) => ({
      id: row.id,
      name: row.destination_name,
      destination: row.destination_name,
      country: row.destination_country,
      category: (row.category as SavedPlace['category']) || 'Nature',
      rating: 4.9,
      image: row.cover_image,
      notes: row.notes || 'Saved destination',
      savedAt: new Date(row.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      }),
    }));
  } catch (err) {
    console.warn('Error fetching from Supabase, falling back to local:', err);
    return getLocalSavedPlaces();
  }
}

export async function toggleSaveDestination(
  destination: Destination,
  notes?: string
): Promise<{ isSaved: boolean; updatedPlaces: SavedPlace[] }> {
  const currentPlaces = getLocalSavedPlaces();
  const exists = currentPlaces.some(
    (p) => p.destination === destination.name || p.id === destination.id || p.name === destination.name
  );

  let updatedPlaces: SavedPlace[];
  let isSaved = false;

  if (exists) {
    // Remove
    updatedPlaces = currentPlaces.filter(
      (p) => p.destination !== destination.name && p.id !== destination.id && p.name !== destination.name
    );
    isSaved = false;
  } else {
    // Add
    const newPlace: SavedPlace = {
      id: destination.id,
      name: destination.name,
      destination: destination.name,
      country: destination.country,
      category: (destination.vibes[0] as SavedPlace['category']) || 'Nature',
      rating: 4.9,
      image: destination.coverImage,
      notes: notes || destination.tagline,
      savedAt: 'Just now',
    };
    updatedPlaces = [newPlace, ...currentPlaces];
    isSaved = true;
  }

  setLocalSavedPlaces(updatedPlaces);

  // Sync to Supabase in background if available
  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        if (isSaved) {
          await (supabase.from('saved_places') as any).upsert({
            user_id: session.user.id,
            destination_id: destination.id,
            destination_name: destination.name,
            destination_country: destination.country,
            cover_image: destination.coverImage,
            category: destination.vibes[0] || 'Nature',
            notes: notes || destination.tagline,
          });
        } else {
          await (supabase.from('saved_places') as any)
            .delete()
            .match({ user_id: session.user.id, destination_id: destination.id });
        }
      }
    } catch (err) {
      console.warn('Supabase sync skipped/failed:', err);
    }
  }

  return { isSaved, updatedPlaces };
}

export async function deleteSavedPlace(placeId: string): Promise<SavedPlace[]> {
  const currentPlaces = getLocalSavedPlaces();
  const updatedPlaces = currentPlaces.filter((p) => p.id !== placeId);
  setLocalSavedPlaces(updatedPlaces);

  const supabase = getSupabaseBrowserClient();
  if (supabase) {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await (supabase.from('saved_places') as any)
          .delete()
          .match({ user_id: session.user.id, destination_id: placeId });
      }
    } catch (err) {
      console.warn('Supabase delete skipped/failed:', err);
    }
  }

  return updatedPlaces;
}
