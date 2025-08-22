import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IAcceptBookingUseCase } from "./Interface/IAcceptBookingUseCase";




export class AcceptBookingUseCase implements IAcceptBookingUseCase {
    constructor(
        private readonly _bookingRepo : IBookingRepository
    ) {};
    async execute(bookingId: string, budget: string): Promise<Booking | null> {
        return await this._bookingRepo.acceptBooking(bookingId, budget);
    };
}