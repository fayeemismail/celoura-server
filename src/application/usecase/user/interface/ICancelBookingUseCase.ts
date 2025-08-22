import { Booking } from "../../../../domain/entities/BookingEntity";



export interface ICancelBookingUseCase {
    execute(bookingId: string): Promise<Booking | null>
}