import { Booking } from "../../../../domain/entities/BookingEntity";



export interface IFetchUserBookingDetailsUseCase {
    execute(bookingId: string) : Promise<Booking | null>
}