import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { IRefreshAccessTokenUseCase } from "./interface/IRefreshAccessTokenUseCase";



export class RefreshAccessTokenUseCase implements IRefreshAccessTokenUseCase {
    constructor(
        private readonly authService: IAuthService,
        private readonly userRepo : IUserRepository
    ){}

    async execute(refreshToken: string): Promise<{ accessToken: string; userId: string; }> {
        console.log("REFRESHING THE TOKEN>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>TOKEN<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<NEKOT EHT GNIHSERFER")
        const payload = this.authService.verifyRefreshToken(refreshToken);

        // Narrow the type to JwtPayload
        if (typeof payload === 'string' || !('id' in payload)) {
            throw new Error('Invalid token payload');
        }

        const user = await this.userRepo.getUserById(payload.id);

        if (!user) throw new Error('User not found');

        const newAccessToken = this.authService.generateAccessToken({ id: user._id, role: user.role });
        return { accessToken: newAccessToken, userId: user._id! };
    }
}