import { IGuideApplicationRepository } from "./interface/IGuideApplicationRepository";
import { GuideApplication } from "../../../domain/entities/GuideApplication";
import guideApplicationModel from "../models/guideApplicationModel";



export class GuideApplicationRepository implements IGuideApplicationRepository {
    async createApplication(application: GuideApplication): Promise<GuideApplication> {
        const newApp = await guideApplicationModel.create(application);
        return newApp.toObject();
    }

    async findUser(userId: string): Promise<any> {
        const result = await guideApplicationModel.findOne({ userId });
        return result
    }

    async findUserByEmail(email: string): Promise<any> {
        const result = await guideApplicationModel.findOne({ email });
        return result
    }

    async findAll(): Promise<GuideApplication[]> {
        return await guideApplicationModel.find()
    }

    async findApplication(id: string): Promise<any> {
        return await guideApplicationModel.findById(id)
    };

    async approveGuideApplication(applicationId: string): Promise<any> {
        const application = await guideApplicationModel.findByIdAndUpdate(
            applicationId,
            { status: 'approved' },
            { new: true }
        );
        return application ?? null;
    }

    async rejectGuideApplication(applicationId: string, reason: string): Promise<void> {
        await guideApplicationModel.findByIdAndUpdate(
            applicationId,
            {
                status: 'rejected',
                rejectReason: reason
            },
            { new: true }
        );
    }

    async findPaginated(page: number, limit: number): Promise<{ data: GuideApplication[], total: number, totalPages: number }> {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            guideApplicationModel.find()
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit),
            guideApplicationModel.countDocuments()
        ]);

        const totalPages = Math.ceil(total / limit);
        return { data, total, totalPages };
    };

    async deleteApplicationById(applicationId: string): Promise<void> {
        const result = await guideApplicationModel.findByIdAndDelete(applicationId);

        if (!result) {
            throw new Error(`Guide application with ID ${applicationId} not found.`);
        }
    };
}