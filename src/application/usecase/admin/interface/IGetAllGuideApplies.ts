import { GuideApplication } from "../../../../domain/entities/GuideApplication";


export interface IGetAllGuideApplies {
    execute(): Promise<GuideApplication[]>
}