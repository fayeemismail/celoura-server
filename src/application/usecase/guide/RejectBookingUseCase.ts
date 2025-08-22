import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IRejectBookingUseCase } from "./Interface/IRejectBookingUseCase";




export class RejectBookingUseCase implements IRejectBookingUseCase {
    constructor(
        private readonly _bookingRepo : IBookingRepository
    ) {};
    async execute(bookingId: string, reason: string): Promise<Booking | null> {
        return await this._bookingRepo.rejectBooking(bookingId, reason);
    };
};