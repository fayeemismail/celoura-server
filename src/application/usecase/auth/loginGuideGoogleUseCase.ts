import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { ILoginGuideGoogleUseCase } from "./interface/ILoginGuideGoogleUseCase";

export class LoginGuideGoogleUseCase implements ILoginGuideGoogleUseCase{
    constructor(
        private readonly userRepo: IUserRepository,
        private readonly authService: IAuthService
    ) {}

    async execute(email: string, name: string): Promise<{guide: User, accessToken: string, refreshToken: string}> {
        if(!email) throw new Error('Invalid Email');
        
        let guide = await this.userRepo.findByEmail(email);
        
        if(!guide) throw new Error('User not found');
        if(guide?.blocked){
            return {guide, accessToken: '', refreshToken: ""};
        }

        if(guide.role == 'user') throw new Error('Access denied');
        if(guide.role == 'admin') throw new Error('Access denied');

        const accessToken = this.authService.generateAccessToken({ id: guide._id, role: guide.role });
        const refreshToken = this.authService.generateRefreshToken({ id: guide._id, role: guide.role });

        return { guide, accessToken, refreshToken };
    }
}