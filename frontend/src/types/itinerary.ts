export interface Destination {
  id: number;
  trip: number;
  name: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  day_number: number;
  notes?: string;
  activities?: Activity[];
  activities_count: number;
  created_at: string;
}

export interface Activity {
  id: number;
  destination: number;
  title: string;
  description?: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'relaxation' | 'shopping' | 'entertainment' | 'transport' | 'other';
  start_time?: string;
  end_time?: string;
  estimated_cost: string;
  booking_url?: string;
  is_completed: boolean;
  created_at: string;
}

export interface DestinationFormData {
  trip: number;
  name: string;
  address?: string;
  latitude?: string;
  longitude?: string;
  day_number: number;
  notes?: string;
}

export interface ActivityFormData {
  destination: number;
  title: string;
  description?: string;
  category: string;
  start_time?: string;
  end_time?: string;
  estimated_cost: string;
  booking_url?: string;
}