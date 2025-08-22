import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IFetchUserBookingDetailsUseCase } from "./interface/IFetchUserBookingDetailsUseCase";



export class FetchUserBookingsDetailsUseCase implements IFetchUserBookingDetailsUseCase {
    constructor(
        private readonly _bookingRepo: IBookingRepository
    ) {};
    async execute(bookingId: string): Promise<Booking | null> {
        if(!bookingId) throw new Error("Booking Id is Missing");
        return await  this._bookingRepo.getBookingById(bookingId);
    }
}