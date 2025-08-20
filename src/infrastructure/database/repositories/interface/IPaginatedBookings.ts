import { Booking } from "../../../../domain/entities/BookingEntity";



export interface PaginatedBookings {
    data: Booking[];
    total: number;
}