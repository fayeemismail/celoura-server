import { Booking } from "../../../../domain/entities/BookingEntity";




export interface IRejectBookingUseCase {
  execute(bookingId: string, reason: string): Promise<Booking | null>;
}