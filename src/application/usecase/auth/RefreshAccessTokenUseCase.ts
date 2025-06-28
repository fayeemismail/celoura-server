import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { IRefreshAccessTokenUseCase } from "./interface/IRefreshAccessTokenUseCase";



export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase {
    constructor(
        private readonly authService: IAuthService,
        private readonly userRepo : IUserRepository
    ){}
    async execute(refreshToken: string): Promise<{ accessToken: string; userId: string; }> {
        const payload = this.authService.verifyRefreshToken(refreshToken);
        const user = await this.userRepo.getUserById(payload.id);

        if(!user) throw new Error('User not found');

        const newAccessToken = this.authService.generateAccessToken({ id: user._id, role: user.role });
        return { accessToken: newAccessToken, userId: user._id! }
    }
}   