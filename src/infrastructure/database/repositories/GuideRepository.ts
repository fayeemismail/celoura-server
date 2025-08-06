import { Types } from "mongoose";
import { Guide } from "../../../domain/entities/Guide";
import guideModel from "../models/guideModel";
import userModel from "../models/userModel";
import { IGetGuideRepository } from "./interface/IGuideRepository";



export class GuideRepository implements IGetGuideRepository {
    async getGuideById(id: string): Promise<Guide | null> {
        return await guideModel.findById(id);
    }

    async findPaginatedGuides( page: number, limit: number, search: string, category: string ): Promise<{ data: any[]; total: number }> {
        const skip = (page - 1) * limit;

        const guideFilter: any = {
            blocked: false,
        };

        let userSearchMatchedIds: Types.ObjectId[] = [];

        // If search is provided, look up user matches first
        if (search) {
            const userSearchFilter = {
                role: "guide",
                blocked: false,
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
            };

            const matchedUsers = await userModel.find(userSearchFilter).select("_id");
            userSearchMatchedIds = matchedUsers.map((u) => new Types.ObjectId(u._id));
        }

        // Merge guide-based search and user-based search into a single `$or`
        if (search) {
            guideFilter.$or = [];

            if (userSearchMatchedIds.length > 0) {
                guideFilter.$or.push({ user: { $in: userSearchMatchedIds } });
            }

            guideFilter.$or.push({ basedOn: { $regex: search, $options: "i" } });
        }

        // Category filter
        if (category) {
            guideFilter.expertise = { $in: [category] };
        }

        const total = await guideModel.countDocuments(guideFilter);

        const guides = await guideModel
            .find(guideFilter)
            .skip(skip)
            .limit(limit)
            .populate({
                path: "user",
                select: "name email",
                match: { blocked: false },
            })
            .select("bio profilePic destinations expertise followers happyCustomers user basedOn");

        const filteredGuides = guides.filter((g) => g.user !== null);

        return {
            data: filteredGuides,
            total,
        };
    };


    async createGuide(guide: Partial<Guide>): Promise<Guide> {
        return await guideModel.create(guide);
    };

    async unBlockGuide(userId: string): Promise<void> {
        await guideModel.updateOne({ user: userId }, { blocked: false })
    };

    async addAvailableDestination(guideId: string, update: Partial<Guide>): Promise<void> {
        await guideModel.findByIdAndUpdate(guideId, update, { new: true });
    }

}