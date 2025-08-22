import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { PaginatedBookings } from "../../../infrastructure/database/repositories/interface/IPaginatedBookings";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IFetchBookingsUseCase } from "./Interface/IFetchBookingsUseCase";




export class FetchBookingsUseCase implements IFetchBookingsUseCase {
    constructor(
        private readonly _bookingRepo : IBookingRepository,
        private readonly _userRepo : IUserRepository
    ) {};
    async execute(guideId: string, page: number, limit: number, search: string, status: string): Promise<PaginatedBookings> {
        if(!guideId) throw new Error("Guide Id missing");
        const guide = await this._userRepo.getUserById(guideId);
        if(!guide) throw new Error("Guide not found");
        return await this._bookingRepo.findPaginatedBookings(guideId, page, limit, search, status); 
    }
}