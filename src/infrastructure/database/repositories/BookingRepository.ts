import bookingModel from "../models/BookingModel";
import { Booking } from "../../../domain/entities/BookingEntity";
import { IBookingRepository } from "./interface/IBookingRepository";
import { FilterQuery, Types } from "mongoose";
import { PaginatedBookings } from "./interface/IPaginatedBookings";




export class BookingRepository implements IBookingRepository {
  async createBooking(data: Booking): Promise<Booking> {
    const booking = new bookingModel(data);
    return await booking.save();
  }

  async getBookingById(id: string): Promise<Booking | null> {
    return await bookingModel.findById(id).lean<Booking>().exec();
  }

  async getBookingsByUser(userId: string): Promise<Booking[]> {
    const data = await bookingModel.find({ "user.id": userId });
    return data
  }

  async getBookingsByGuide(guideId: string): Promise<Booking[]> {
    const data = await bookingModel.find({ "guide.id": guideId });
    return data
  }

  async updateBooking(id: string, updates: Partial<Booking>): Promise<Booking | null> {
    return await bookingModel.findByIdAndUpdate(id, updates, { new: true }).lean<Booking>().exec();
  }

  async deleteBooking(id: string): Promise<boolean> {
    const result = await bookingModel.findByIdAndDelete(id).exec();
    return result ? true : false;
  };

  async hasConflictingBooking(guideId: string, userId: string, startDate: Date, endDate: Date): Promise<Boolean> {
    const query: FilterQuery<Booking> = {
      $or: [{ "guide.id": guideId }, { "user.id": userId }],
      status: { $in: ["accepted"] },
      startDate: { $lte: endDate },
      endDate: { $gte: startDate }
    };

    const existingBooking = await bookingModel.findOne(query).exec();
    return existingBooking !== null;
  };

  async findPaginatedBookings(guideId: string, page: number, limit: number, search: string, status: string): Promise<PaginatedBookings> {
    const skip = (page - 1) * limit;
    const query: Record<string, unknown> = { "guide.id": guideId };


    if (search) {
      query.$or = [
        { "user.name": { $regex: search, $options: "i" } },
        { locations: { $regex: search, $options: "i" } }
      ]
    };

    if (status && status !== "all") {
      query.status = status;
    }

    const totalDocs = await bookingModel.countDocuments(query);
    const data = await bookingModel.find(query)
      .sort({ createdAt: -1, _id: -1 })
      .skip(skip)
      .limit(limit);


    return { data, total: totalDocs }
  };

  async existingBookings(guideId: string, userId: string, startDate: Date, endDate: Date): Promise<Boolean> {
    const data = await bookingModel.findOne({
      "guide.id": guideId,
      "user.id": userId,
      status: { $in: ["pending", "accepted"] },
      $or: [
        {
          startDate: { $lte: startDate },
          endDate: { $gte: endDate }
        }
      ] 
    });

    return data !== null
  }
}
