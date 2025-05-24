import { IGuideApplicationRepository } from "./interface/IGuideApplicationRepository";
import { GuideApplication } from "../../../domain/entities/GuideApplication";
import guideApplicationModel from "../models/guideApplicationModel";



export class GuideApplicationRepository implements IGuideApplicationRepository {
    async createApplication(application: GuideApplication): Promise<GuideApplication> {
        const newApp = await guideApplicationModel.create(application);
        return newApp.toObject();
    }

    async findUser(userId: string): Promise<any> {
        const result = await guideApplicationModel.findOne({userId});
        return result
    }

    async findUserByEmail(email: string): Promise<any> {
        const result = await guideApplicationModel.findOne({email});
        return result
    }

    async findAll(): Promise<GuideApplication[]> {
        return await guideApplicationModel.find()
    }

    async findApplication(id: string): Promise<any> {
        return await guideApplicationModel.findById(id)
    }

}