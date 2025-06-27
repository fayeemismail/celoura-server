import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IBlockUserUseCase } from "./interface/IBlockUserUseCase";



export class BlockUserUseCase implements IBlockUserUseCase {

    constructor( 
        private readonly _userRepo: IUserRepository
    ) {}
    async execute(userId: string): Promise<void> {
        const user = await this._userRepo.getUserById(userId);
        if(!user || !user._id) throw new Error('User not found');
        await this._userRepo.blockUser(user._id);
    }
}