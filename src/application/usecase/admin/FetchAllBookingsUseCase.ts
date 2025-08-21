import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IFetchAllBookingsUseCase } from "./interface/IFetchAllBookingsUseCase";



export class FetchAllBookingsUseCase implements IFetchAllBookingsUseCase {
    constructor(
        private readonly _bookingRepo: IBookingRepository
    ) {};
    async execute(adminId: string): Promise<Booking[]> {
        if(!adminId) throw new Error("Admin Id is missing");
        return await this._bookingRepo.fetchAllBookings()
    }
}