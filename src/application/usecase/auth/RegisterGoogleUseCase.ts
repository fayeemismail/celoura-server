import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import {IRegisterGoogleUseCase } from "./interface/IRegisterGoogleUseCase";

export class RegisterGoogleUserUseCase implements IRegisterGoogleUseCase {
    constructor(
        private _userRepo : IUserRepository,
        private _authService : IAuthService
    ) {}
    async execute(email: string, name: string): Promise<{ user: User; accessToken: string; refreshToken: string; }> {
        if(!email) throw new Error('Invalid Email');

        let user = await this._userRepo.findByEmail(email);

        if(user?.blocked) return { user, accessToken: '', refreshToken: "" };

        if(user?.role === 'guide' || user?.role === 'admin'){
            throw new Error("Access denied");
        };

        if(!user) {
            user = await this._userRepo.createUser({
                name,
                email,
                password: "",
                blocked: false,
                role: 'user',
                googleUser: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        };

        const accessToken = this._authService.generateAccessToken({
            id: user._id,
            role: user.role,
        });

        const refreshToken = this._authService.generateRefreshToken({
            id: user._id,
            role: user.role
        });
        
        return { user, accessToken, refreshToken };
    }
}