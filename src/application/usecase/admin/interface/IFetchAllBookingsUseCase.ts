import { PaginatedBookings } from "../../../../infrastructure/database/repositories/interface/IPaginatedBookings";



export interface IFetchAllBookingsUseCase {
    execute(page: number, limit: number): Promise<PaginatedBookings>;
}