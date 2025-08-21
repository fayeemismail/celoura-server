import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { ICancelBookingUseCase } from "./interface/ICancelBookingUseCase";



export class CancelBookingUseCase implements ICancelBookingUseCase {
    constructor(
        private readonly _bookingRepo : IBookingRepository
    ) {};
    async execute(bookingId: string): Promise<Booking | null> {
        if(!bookingId) throw new Error("Booking Id is missing");
        return await this._bookingRepo.cancelBooking(bookingId);
    }
}