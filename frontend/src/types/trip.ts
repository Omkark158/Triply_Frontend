// Primary Trip interface (used by TripContext and most components)
// This matches what the backend actually returns
export interface Trip {
  id: string | number; // Backend might return either string or number
  title: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: 'USD' | 'INR';
  description: string;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  user: string | number;
}

// Alternative Trip interface for services that expect different format
export interface TripDetailed {
  id: number;
  user: number;
  user_email: string;
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string;
  is_public: boolean;
  duration_days: number;
  created_at: string;
  updated_at: string;
}

// Form data for creating/updating trips
export interface TripFormData {
  title: string;
  description?: string;
  destination: string;
  start_date: string;
  end_date: string;
  budget: string | number;
  is_public?: boolean;
  currency?: 'USD' | 'INR';
}

export interface CreateTripData {
  title: string;
  destination: string;
  description?: string;
  start_date: string;
  end_date: string;
  budget?: number;
  currency?: 'USD' | 'INR';
  is_public?: boolean;
}

export interface UpdateTripData extends Partial<CreateTripData> {
  // Can update any field from CreateTripData
}

// Collaborator types
export interface TripCollaborator {
  id: string;
  trip: string;
  user: string;
  role: 'owner' | 'editor' | 'viewer';
  added_at: string;
  user_details?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
  };
}

export interface Participant {
  id: number;
  user_id: number;
  name?: string;
  email: string;
  role?: 'owner' | 'editor' | 'viewer';
}

// Budget types
export interface Budget {
  id: string;
  trip: string;
  currency: 'USD' | 'INR';
  total_budget: number;
  spent_amount: number;
  remaining_amount: number;
  spent_percentage: number;
  updated_at: string;
}

// Expense types
export interface Expense {
  id: string;
  trip: string;
  expense_type: 'personal' | 'group';
  title: string;
  description?: string;
  amount: number;
  category: 'accommodation' | 'food' | 'transport' | 'activities' | 'shopping' | 'entertainment' | 'emergency' | 'other';
  date: string;
  paid_by: string;
  split_between: string[];
  receipt_image?: string;
  created_at: string;
  updated_at: string;
}

// Destination types
export interface Destination {
  id: string;
  trip: string;
  name: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  day_number: number;
  notes?: string;
  created_at: string;
  activities?: Activity[];
}

// Activity types
export interface Activity {
  id: string;
  destination: string;
  title: string;
  description?: string;
  category: 'sightseeing' | 'food' | 'adventure' | 'relaxation' | 'shopping' | 'entertainment' | 'transport' | 'other';
  start_time?: string;
  end_time?: string;
  estimated_cost: number;
  booking_url?: string;
  is_completed: boolean;
  created_at: string;
}

// Invitation types
export interface TripInvitation {
  id: string;
  trip: string;
  inviter: string;
  invitee_email: string;
  role: 'owner' | 'editor' | 'viewer';
  token: string;
  status: 'pending' | 'accepted' | 'declined' | 'expired';
  message?: string;
  created_at: string;
  expires_at: string;
  is_expired: boolean;
}