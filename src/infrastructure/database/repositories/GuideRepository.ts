import { Types } from "mongoose";
import { Guide } from "../../../domain/entities/Guide";
import guideModel from "../models/guideModel";
import userModel from "../models/userModel";
import { IGetGuideRepository } from "./interface/IGuideRepository";



export class GuideRepository implements IGetGuideRepository {
    async getGuideById(id: string): Promise<Guide | null> {
        return await guideModel.findById(id);
    }

    async findPaginatedGuides( page: number, limit: number, search: string, category: string): Promise<{ data: any[]; total: number }> {
        const skip = (page - 1) * limit;


        const userFilter: any = {
            role: "guide",
            blocked: false,
        };

        if (search) {
            userFilter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
            ];
        }

        const matchedUsers = await userModel.find(userFilter).select("_id");
        const matchedUserIds = matchedUsers.map(user => new Types.ObjectId(user._id));

        if (matchedUserIds.length === 0) {
            return { data: [], total: 0 };
        }


        const guideFilter: any = {
            blocked: false,
            user: { $in: matchedUserIds },
        };


        if (search) {
            guideFilter.$or = [
                { basedOn: { $regex: search, $options: "i" } }
            ];
        }

        const total = await guideModel.countDocuments(guideFilter);

        const guides = await guideModel.find(guideFilter)
            .skip(skip)
            .limit(limit)
            .populate({
                path: "user",
                select: "name email",
                match: { blocked: false },
            })
            .select("bio profilePic destinations expertise followers happyCustomers user basedOn");



        const filteredGuides = guides.filter(g => g.user !== null);

        return { data: filteredGuides, total };
    }

    async createGuide(guide: Partial<Guide>): Promise<Guide> {
        return await guideModel.create(guide);
    };

    async unBlockGuide(userId: string): Promise<void> {
        await guideModel.updateOne({ user: userId }, { blocked: false })
    }

}