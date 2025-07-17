import { Guide } from "../../../domain/entities/Guide";
import guideModel from "../models/guideModel";
import userModel from "../models/userModel";
import { IGetGuideRepository } from "./interface/IGuideRepository";



export class GuideRepository implements IGetGuideRepository {
    async getGuideById(id: string): Promise<Guide | null> {
        return await guideModel.findById(id);
    }
    async findPaginatedGuides(page: number, limit: number, search: string, category: string): Promise<{ data: any[]; total: number }> {
        const skip = (page - 1) * limit;

        const userFilter: any = {};
        if (search) {
            userFilter.$or = [
                { name: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } }
            ];
        }

        const users = await userModel.find({
            ...userFilter,
            role: "guide",
            blocked: false
        }).select("_id name email");

        const userIds = users.map(user => user._id);

        const guideFilter: any = {
            user: { $in: userIds }
        };

        const total = await guideModel.countDocuments(guideFilter);

        const guides = await guideModel.find(guideFilter)
            .skip(skip)
            .limit(limit)
            .populate("user", "name email")
            .select("bio profilePic destinations followers happyCustomers user");

        return { data: guides, total };
    }

}