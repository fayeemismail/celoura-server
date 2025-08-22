import { Booking } from "../../../../domain/entities/BookingEntity";




export interface IAcceptBookingUseCase {
  execute(bookingId: string, budget: string): Promise<Booking | null>;
}
