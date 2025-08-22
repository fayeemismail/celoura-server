import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IFetchBookingDetailsUseCase } from "./Interface/IFetchBookingDetailsUseCase";




export class FetchBookingDetailsUseCase implements IFetchBookingDetailsUseCase {
    constructor(
        private readonly _bookingRepo : IBookingRepository
    ) {};
    async execute(bookingId: string): Promise<Booking | null> {
        if(!bookingId) throw new Error("Booking Id is missing");
        
        const bookingData = await this._bookingRepo.getBookingById(bookingId);
        return bookingData
    }
}