import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "../../../infrastructure/database/repositories/interface/IBookingRepository";
import { IGetGuideRepository } from "../../../infrastructure/database/repositories/interface/IGuideRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { BookGuide } from "../../dto/user/IBookGuideData";
import { IBookGuideUseCase } from "./interface/IBookGuideUseCase";



export class BookGuideUseCase implements IBookGuideUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _guideRepo: IGetGuideRepository,
        private readonly _bookingRepo: IBookingRepository
    ) { };
    async execute(BookingData: BookGuide): Promise<Booking | null> {
        const { guideId,
            userId,
            name,
            email,
            phone,
            address,
            startDate,
            endDate,
            days,
            specialRequests,
            selectedDestinations } = BookingData;
        

        if(!name || !email || !phone || !address || !startDate || !endDate || !days || !selectedDestinations ) {
            throw new Error("All fields are required");
        };
        if(!userId || !guideId) throw new Error("User Id or Guide Id not found");
        
        const guideUser = await this._userRepo.getUserById(guideId);
        if(!guideUser) throw new Error("Guide User not found");

        const guide = await this._userRepo.getGuideById(guideUser._id!);
        if(!guide) throw new Error("Guide not found");

        const user = await this._userRepo.getUserById(userId);
        if(!user) throw new Error("User not found");

        if(email !== user.email) throw new Error("Email does not match to the current User");

        const hasConflict = await this._bookingRepo.hasConflictingBooking(guideId, userId, startDate, endDate);
        if(hasConflict) throw new Error("Guide already has a booking during the period");

        const existingBooking = await this._bookingRepo.existingBookings(guideId, userId, startDate, endDate);
        if(existingBooking) throw new Error("You already have a booking request for this guide within the selected dates.");


        const booking = await this._bookingRepo.createBooking({
            guide: {
                id: guideUser._id!,
                name: guideUser.name,
                email: guideUser.email      
            },
            user: {
                id: user._id!,
                name: name,
                email: user.email,
                phone: phone,
                address: address
            },
            startDate: new Date(startDate),
            endDate: new Date(endDate),
            durationInDays: days,
            locations: selectedDestinations,
            status: "pending",
            guideAccepted: false,
            rejected: false,
            rejectedReason: "",
            specialRequests: specialRequests ?? ""
        });

        return booking
    }
}