import { IGetGuideRepository } from "../../../infrastructure/database/repositories/interface/IGuideRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetGuidePaginatedUseCase } from "./interface/IGetGuidesPaginatedusecase";






export class GetGuidesPaginatedUseCase implements IGetGuidePaginatedUseCase {
    constructor(
        private guideRepo: IGetGuideRepository,
        private userRepo: IUserRepository
    ) { }

    async execute(page: number, limit: number, search: string, category: string): Promise<any> {
        const { data, total } = await this.guideRepo.findPaginatedGuides(page, limit, search, category);

        const result = data.map((guide: any) => ({
            _id: guide.user._id,
            name: guide.user.name,
            email: guide.user.email,
            profilePic: guide.profilePic,
            bio: guide.bio,
            destinations: guide.destinations,
            followers: guide.followers.length,
            happyCustomers: guide.happyCustomers.length,
            basedOn: guide.basedOn
        }));

        return { data: result, total };
    }
}
