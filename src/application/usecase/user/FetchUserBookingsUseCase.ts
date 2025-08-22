import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IFetchUserBookingsUseCase } from "./interface/IFetchUserBookingsUseCase";




export class FetchUserBookingsUseCase implements IFetchUserBookingsUseCase {
    constructor(
        private readonly _bookingRepo : IBookingRepository
    ) {}
    async execute(userId: string): Promise<Booking[]> {
        return await this._bookingRepo.getBookingsByUser(userId);
    }
}