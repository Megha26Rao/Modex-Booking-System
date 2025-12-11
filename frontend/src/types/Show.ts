// /frontend/src/types/Show.ts - FINALIZED INTERFACE DEFINITIONS

export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'FAILED';

export interface Show {
    id: number;
    name: string;
    start_time: string; 
    total_seats: number; 
    created_at: string;
    theatre_name: string; // New field
}

export interface Booking {
    id: number;
    show_id: number;
    user_id: string; 
    seat_count: number; 
    status: BookingStatus;
    created_at: string;
}

export interface ShowContextType {
    shows: Show[];
    fetchShows: () => Promise<void>;
    createShow: (data: any) => Promise<boolean>;
    // Updated signature for multiple seats
    bookSeats: (showId: number, userName: string, userPhone: string, seatCount: number) => Promise<string>; 
}