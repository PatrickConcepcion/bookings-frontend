export interface Booking {
  id: number;
  user_id: number;
  date: string;
  start_time: string;
  end_time: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
  };
}

export interface CreateBookingData {
  date: string;
  start_time: string;
  end_time: string;
  notes?: string;
}

export interface UpdateBookingData {
  date?: string;
  start_time?: string;
  end_time?: string;
  status?: string;
  notes?: string;
}
