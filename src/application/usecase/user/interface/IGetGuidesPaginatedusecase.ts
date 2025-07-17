import { User } from "../../../../domain/entities/User";



export interface IGetGuidePaginatedUseCase {
    execute(page: number, limit: number, search: string, category: string): Promise<any>;
}