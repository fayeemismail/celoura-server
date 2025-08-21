import { Booking } from "../../../../domain/entities/BookingEntity";



export interface IFetchAllBookingsUseCase {
    execute(adminId: string): Promise<Booking[]>;
}