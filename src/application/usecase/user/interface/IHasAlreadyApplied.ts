import { GuideApplication } from "../../../../domain/entities/GuideApplication";



export interface IHasAlreadyApplied {
    execute(userId: string): Promise<GuideApplication | null>;
}