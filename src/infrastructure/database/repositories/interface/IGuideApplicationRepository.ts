import { GuideApplication } from "../../../../domain/entities/GuideApplication";


export interface IGuideApplicationRepository {
    createApplication(application: GuideApplication): Promise<GuideApplication>;
    findUser(userId: string): Promise<any>;
    findUserByEmail(email: string): Promise<any>
    findAll(): Promise<GuideApplication[]>;
    findApplication(id: string): Promise<any>;
    approveGuideApplication(applicationId:string): Promise<any>;
    rejectGuideApplication(applicationId: string, reason: string): Promise<void>;
    findPaginated(page: number, limit: number): Promise<any>;
}