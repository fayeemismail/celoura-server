import { Booking } from "../../../../domain/entities/BookingEntity";
import { PaginatedBookings } from "./IPaginatedBookings";

export interface IBookingRepository {
  createBooking(data: Booking): Promise<Booking>;
  getBookingById(id: string): Promise<Booking | null>;
  getBookingsByUser(userId: string): Promise<Booking[]>;
  getBookingsByGuide(guideId: string): Promise<Booking[]>;
  updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null>;
  deleteBooking(id: string): Promise<boolean>;
  hasConflictingBooking(guideId: string, userId: string, startDate: Date, endDate: Date): Promise<Boolean>;
  findPaginatedBookings(guideId:string, page: number, limit: number, search: string, status: string): Promise<PaginatedBookings>;
  existingBookings(guideId: string, userId: string, startDate: Date, endDate: Date): Promise<Boolean>
  acceptBooking(bookingId: string, budget: string): Promise<Booking | null>;
  rejectBooking(bookingId: string, reason: string): Promise<Booking | null>;
  cancelBooking(bookingId: string): Promise<Booking | null>;
  fetchAllBookings(): Promise<Booking[]>;
}
