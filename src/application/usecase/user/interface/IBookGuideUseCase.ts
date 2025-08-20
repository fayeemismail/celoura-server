import { Booking } from "../../../../domain/entities/BookingEntity";
import { BookGuide } from "../../../dto/user/IBookGuideData";


export interface IBookGuideUseCase {
    execute(BookingData: BookGuide): Promise<Booking | null>;
}