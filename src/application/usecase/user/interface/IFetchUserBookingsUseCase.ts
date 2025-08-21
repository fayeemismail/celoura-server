import { Booking } from "../../../../domain/entities/BookingEntity";




export interface IFetchUserBookingsUseCase {
    execute(userId: string): Promise<Booking[]>;
}