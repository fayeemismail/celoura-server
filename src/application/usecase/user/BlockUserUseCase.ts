import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IBlockUserUseCase } from "./interface/IBlockUserUseCase";



export class BlockUserUseCase implements IBlockUserUseCase {
    
    constructor( 
        private _userRepo: IUserRepository
    ) {}
    async execute(userId: string): Promise<void> {
        const user = await this._userRepo.getUserById(userId);
        if(!user || !user._id) throw new Error('User not found');
        //@ts-ignore
        const targetId = typeof user._id === 'string' ? user._id : user._id.toString();
        await this._userRepo.blockUser(targetId)
    }
}