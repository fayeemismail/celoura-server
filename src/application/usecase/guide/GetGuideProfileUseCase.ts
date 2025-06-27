import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetGuideProfile } from "./Interface/IGetGuideProfileUseCase";



export class GetGuideProfileUseCase implements IGetGuideProfile {
    constructor(
        private readonly userRepo: IUserRepository
    ){}
    async findAll(): Promise<User[]> {
        const allUsers = await this.userRepo.findAll()
        const guide = allUsers.filter(user => user.role == 'guide');
        return guide
    }
    async findById(id: string): Promise<User | null> {
        return await this.userRepo.getUserById(id)
    };
    async getMe(id: string): Promise<User> {
        const user = await this.userRepo.getUserById(id);
        if(!user) throw new Error('Cannot find user');
        return user;
    }
}