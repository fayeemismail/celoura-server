import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IAuthService } from "../../interfaces/services/IAuthService";
import {IRegisterGoogleUseCase } from "./interface/IRegisterGoogleUseCase";

export class RegisterGoogleUserUseCase implements IRegisterGoogleUseCase {
    constructor(
        private userRepo : IUserRepository,
        private authService : IAuthService
    ) {}

    async executee(email: string, name: string): Promise<User> {
        if(!email) throw new Error ("Invalid Email");

        let user = await this.userRepo.findByEmail(email);
        if(user?.blocked){
            return user;
        }

        if(user?.role == 'guide') throw new Error('Access denied');
        if(user?.role == 'admin') throw new Error('Access denied');

        if(!user){
            user = await this.userRepo.createUser({
                name,
                email,
                password: '',
                blocked: false,
                role: 'user',
                googleUser: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        return user;
    }
    async execute(email: string, name: string): Promise<{ user: User; accessToken: string; refreshToken: string; }> {
        if(!email) throw new Error('Invalid Email');

        let user = await this.userRepo.findByEmail(email);

        if(user?.blocked) return { user, accessToken: '', refreshToken: "" };

        if(user?.role === 'guide' || user?.role === 'admin'){
            throw new Error("Access denied");
        };

        if(!user) {
            user = await this.userRepo.createUser({
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

        const accessToken = this.authService.generateAccessToken({
            id: user._id,
            role: user.role,
        });

        const refreshToken = this.authService.generateRefreshToken({
            id: user._id,
            role: user.role
        });

        return { user, accessToken, refreshToken };
    }
}