import { GuideApplication } from "../../../domain/entities/GuideApplication";


export interface IGuideApplicationRepository {
    createApplication(application: GuideApplication): Promise<GuideApplication>;
    findUser(userId: string): Promise<any>;
    findUserByEmail(email: string): Promise<any>
}