import { User } from "../../../../domain/entities/User";
import { GuidePaginatedReturnDTO } from "../../../dto/user/GuideApplicationDTO";



export interface IGetGuidePaginatedUseCase {
    execute(page: number, limit: number, search: string, category: string): Promise<GuidePaginatedReturnDTO>;
}