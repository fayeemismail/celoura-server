import { GuideApplication } from "../../../../domain/entities/GuideApplication";


export interface IGetAllGuideApplies {
    execute(page: number, limit: number): Promise<{data: GuideApplication[], total: number, totalPages: number}>
}