import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { GuideWithUserData } from "../../dto/guide/guideProfileDto";
import { IGetGuideProfile } from "./Interface/IGetGuideProfileUseCase";



export class GetGuideProfileUseCase implements IGetGuideProfile {
    constructor(
        private readonly _userRepo: IUserRepository
    ) { }
    async findAll(): Promise<User[]> {
        const allUsers = await this._userRepo.findAll()
        const guide = allUsers.filter(user => user.role == 'guide');
        return guide
    }
    async findById(id: string): Promise<GuideWithUserData | null> {
        const guideUser = await this._userRepo.getUserById(id);
        const guide = await this._userRepo.getGuideById(id);

        if (!guideUser || !guide) {
            throw new Error('Guide not found');
        }

        const combined: GuideWithUserData = {
            _id: guide.user.toString(),
            name: guideUser.name,
            email: guideUser.email,
            role: guideUser.role, // must be "guide" | "admin" | "user"
            is_verified: guideUser.is_verified,
            googleUser: guideUser.googleUser,
            userCreatedAt: guideUser.createdAt,
            userUpdatedAt: guideUser.updatedAt,

            destinations: guide.destinations,
            happyCustomers: guide.happyCustomers,
            followers: guide.followers,
            posts: guide.posts,
            bio: guide.bio,
            profilePic: guide.profilePic,
            availableDestinations: guide.availableDestinations
        };

        return combined;
    }
    async getMe(id: string): Promise<User> {
        const user = await this._userRepo.getUserById(id);
        if (!user) throw new Error('Cannot find user');
        return user;
    }
}