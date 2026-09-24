import { getSupabaseBrowserClient } from '@/lib/supabase/client';
import type { TripSummary, ItineraryDay } from '@/types';
import { MOCK_TRIPS, MOCK_ITINERARY_DAYS } from '@/constants';

export async function fetchUserTrips(): Promise<TripSummary[]> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return MOCK_TRIPS;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session?.user) {
      return MOCK_TRIPS;
    }

    const { data, error } = await supabase
      .from('trips')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return MOCK_TRIPS;
    }

    return (data as any[]).map((row: any) => ({
      id: row.id,
      title: row.title,
      destination: row.destination,
      country: row.country,
      startDate: row.start_date,
      endDate: row.end_date,
      daysCount: row.days_count,
      coverImage: row.cover_image,
      gradient: row.gradient,
      status: row.status as 'upcoming' | 'completed' | 'draft',
      estimatedBudget: Number(row.estimated_budget),
      spentBudget: Number(row.spent_budget),
      currency: row.currency,
      pace: row.pace,
      vibe: row.vibes,
      description: row.description,
    }));
  } catch (err) {
    console.warn('Error fetching trips from Supabase:', err);
    return MOCK_TRIPS;
  }
}

export async function saveTripToCloud(
  trip: TripSummary,
  days?: ItineraryDay[]
): Promise<boolean> {
  const supabase = getSupabaseBrowserClient();
  if (!supabase) {
    return false;
  }

  try {
    const { data: { session } } = await supabase.auth.getSession();
    const userId = session?.user?.id || null;

    const { error: tripError } = await (supabase.from('trips') as any).upsert({
      id: trip.id,
      user_id: userId,
      title: trip.title,
      destination: trip.destination,
      country: trip.country,
      start_date: trip.startDate,
      end_date: trip.endDate,
      days_count: trip.daysCount,
      cover_image: trip.coverImage,
      gradient: trip.gradient,
      status: trip.status,
      estimated_budget: trip.estimatedBudget,
      spent_budget: trip.spentBudget,
      currency: trip.currency,
      pace: trip.pace,
      vibes: trip.vibe,
      description: trip.description,
    });

    if (tripError) {
      console.warn('Failed to save trip to Supabase:', tripError);
      return false;
    }

    if (days && days.length > 0) {
      for (const day of days) {
        await (supabase.from('itinerary_days') as any).upsert({
          id: `${trip.id}_day_${day.dayNumber}`,
          trip_id: trip.id,
          day_number: day.dayNumber,
          date: day.date,
          theme: day.theme,
          activities: day.activities as unknown as Record<string, unknown>[],
        });
      }
    }

    return true;
  } catch (err) {
    console.warn('Cloud trip save error:', err);
    return false;
  }
}
