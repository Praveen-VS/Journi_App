export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string | null;
          avatar_url: string | null;
          home_city: string | null;
          currency: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          full_name?: string | null;
          avatar_url?: string | null;
          home_city?: string | null;
          currency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          home_city?: string | null;
          currency?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      saved_places: {
        Row: {
          id: string;
          user_id: string;
          destination_id: string;
          destination_name: string;
          destination_country: string;
          cover_image: string;
          category: string;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          destination_id: string;
          destination_name: string;
          destination_country: string;
          cover_image: string;
          category?: string;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          destination_id?: string;
          destination_name?: string;
          destination_country?: string;
          cover_image?: string;
          category?: string;
          notes?: string | null;
          created_at?: string;
        };
      };
      trips: {
        Row: {
          id: string;
          user_id: string | null;
          title: string;
          destination: string;
          country: string;
          start_date: string;
          end_date: string;
          days_count: number;
          cover_image: string;
          gradient: string;
          status: string;
          estimated_budget: number;
          spent_budget: number;
          currency: string;
          pace: string;
          vibes: string[];
          description: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          title: string;
          destination: string;
          country: string;
          start_date: string;
          end_date: string;
          days_count?: number;
          cover_image: string;
          gradient?: string;
          status?: string;
          estimated_budget?: number;
          spent_budget?: number;
          currency?: string;
          pace?: string;
          vibes?: string[];
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          title?: string;
          destination?: string;
          country?: string;
          start_date?: string;
          end_date?: string;
          days_count?: number;
          cover_image?: string;
          gradient?: string;
          status?: string;
          estimated_budget?: number;
          spent_budget?: number;
          currency?: string;
          pace?: string;
          vibes?: string[];
          description?: string;
          created_at?: string;
        };
      };
      itinerary_days: {
        Row: {
          id: string;
          trip_id: string;
          day_number: number;
          date: string;
          theme: string;
          activities: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          trip_id: string;
          day_number: number;
          date: string;
          theme: string;
          activities: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          trip_id?: string;
          day_number?: number;
          date?: string;
          theme?: string;
          activities?: Json;
          created_at?: string;
        };
      };
    };
  };
}
