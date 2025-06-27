import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository"
import { IGetUserProfile } from "./interface/IGetUserProfileUseCase";



export class GetUserProfile implements IGetUserProfile {
    constructor(
        private readonly _userRepo: IUserRepository
    ){}
    async execute(id: string): Promise<User> {
        const user = await this._userRepo.getUserById(id);
        if(!user) throw new Error('User not found');
        return user;
    }
}