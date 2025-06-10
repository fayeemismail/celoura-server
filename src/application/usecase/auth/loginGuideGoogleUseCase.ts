import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { ILoginGuideGoogleUseCase } from "./interface/ILoginGuideGoogleUseCase";

export class loginGuideGoogleUseCase implements ILoginGuideGoogleUseCase{
    private userRepo: UserRepository

    constructor() {
        this.userRepo = new UserRepository();
    }

    async execute(email: string, name: string): Promise<User> {
        if(!email) throw new Error('Invalid Email');
        
        let guide = await this.userRepo.findByEmail(email);
        
        if(!guide) throw new Error('User not found');
        if(guide?.blocked){
            return guide;
        }

        if(guide.role == 'user') throw new Error('Access denied');
        if(guide.role == 'admin') throw new Error('Access denied');

        return guide;
    }
}