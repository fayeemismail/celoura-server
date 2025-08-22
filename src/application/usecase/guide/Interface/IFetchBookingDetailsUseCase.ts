import { Booking } from "../../../../domain/entities/BookingEntity";



export interface IFetchBookingDetailsUseCase {
    execute(bookingId: string): Promise<Booking | null>;
}