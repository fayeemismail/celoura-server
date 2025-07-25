import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetSingleGuideUseCase } from "./interface/IGetSingleGuideUseCase";

export class GetSingleGuideUseCase implements IGetSingleGuideUseCase {
    constructor(
        private userRepo: IUserRepository
    ) { }

    async execute(id: string): Promise<any> {
        if (!id) throw new Error("Id not found");

        const user = await this.userRepo.getUserById(id);
        if (!user) throw new Error("User not found");

        const guide = await this.userRepo.getGuideById(id); // Must populate user, followers, happyCustomers, posts
        if (!guide) throw new Error("Guide not found");

        return {
            _id: user._id!.toString(),
            name: user.name,
            email: user.email,
            profilePic: guide.profilePic || null,
            bio: guide.bio || "",
            basedOn: guide.basedOn,
            destinations: guide.destinations,
            followers: guide.followers.map((f: any) => f._id.toString()),
            happyCustomers: guide.happyCustomers.map((h: any) => h._id.toString()),
        };
    }
};