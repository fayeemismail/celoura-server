import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { PaginatedBookings } from "../../../infrastructure/database/repositories/interface/IPaginatedBookings";
import { IFetchAllBookingsUseCase } from "./interface/IFetchAllBookingsUseCase";



export class FetchAllBookingsUseCase implements IFetchAllBookingsUseCase {
    constructor(
        private readonly _bookingRepo: IBookingRepository
    ) {};
    async execute(page: number, limit: number): Promise<PaginatedBookings> {
        return await this._bookingRepo.findBookingsPaginated(page, limit)
    }
}