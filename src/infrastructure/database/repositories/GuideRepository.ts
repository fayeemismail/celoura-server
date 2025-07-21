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

        let userIds: string[] = [];

        // Step 1: Search users if search exists
        if (search) {
            const users = await userModel.find({
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ],
                role: "guide",
                blocked: false,
            }).select("_id");

            userIds = users.map(user => user._id.toString());
        }

        // Step 2: Build guide filter
        const guideFilter: any = {};

        // If search exists, allow matching either `basedOn` OR matched user IDs
        if (search) {
            guideFilter.$or = [
                { basedOn: { $regex: search, $options: "i" } },
                { user: { $in: userIds } }
            ];
        }

        const total = await guideModel.countDocuments(guideFilter);

        const guides = await guideModel.find(guideFilter)
            .skip(skip)
            .limit(limit)
            .populate("user", "name email")
            .select("bio profilePic destinations followers happyCustomers user basedOn");

        return { data: guides, total };
    }

}