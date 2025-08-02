import { Guide } from "../../../../domain/entities/Guide";



export interface IGetGuideRepository {
    getGuideById(id: string): Promise<Guide | null>
    findPaginatedGuides(page: number, limit: number, search: string, category: string): Promise<{ data: any[]; total: number }>;
    createGuide(guide: Partial<Guide>): Promise<Guide>;
    unBlockGuide(userId: string): Promise<void>
}