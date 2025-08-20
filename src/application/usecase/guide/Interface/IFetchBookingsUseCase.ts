import { Booking } from "../../../../domain/entities/BookingEntity";
import { PaginatedBookings } from "../../../../infrastructure/database/repositories/interface/IPaginatedBookings";



export interface IFetchBookingsUseCase {
    execute(guideId: string, page: number, limit: number, search: string, status: string): Promise<PaginatedBookings>;
}