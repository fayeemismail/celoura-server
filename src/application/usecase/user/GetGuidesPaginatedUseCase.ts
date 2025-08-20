import { IGetGuideRepository } from "../../../infrastructure/database/repositories/interface/IGuideRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { GuideDto } from "../../dto/user/GuideDto";
import { IGetGuidePaginatedUseCase } from "./interface/IGetGuidesPaginatedusecase";






export class GetGuidesPaginatedUseCase implements IGetGuidePaginatedUseCase {
    constructor(
        private _guideRepo : IGetGuideRepository,
        private _userRepo: IUserRepository
    ) { }

    async execute(page: number, limit: number, search: string, category: string): Promise<any> {
        const { data, total } = await this._guideRepo.findPaginatedGuides(page, limit, search, category);

        const result: GuideDto[] = data.map((guide) => ({
            _id: guide.user._id,
            name: guide.user.name,
            email: guide.user.email,
            profilePic: guide.profilePic,
            bio: guide.bio,
            destinations: guide.destinations,
            followers: guide.followers.length,
            happyCustomers: guide.happyCustomers.length,
            basedOn: guide.basedOn,
            expertise: guide.expertise
        }));

        return { data: result, total };
    }
};
