import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IUnBlockUserUseCase } from "./interface/IUnBlockUserUseCase";



export class UnBlockUserUseCase implements IUnBlockUserUseCase {
    
    constructor(
        private _userRepo: IUserRepository
    ) {}
    async execute(userId: string): Promise<void> {
        const user = await this._userRepo.getUserById(userId);
        if(!user || !user._id) throw new Error('User not found');
        await this._userRepo.unBlockUser(user._id)
    }
}