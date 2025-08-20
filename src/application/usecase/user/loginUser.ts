import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { HttpStatusCode } from "../../constants/httpStatus";
import { IAuthService } from "../../interfaces/services/IAuthService";
import { IPasswordService } from "../../interfaces/services/IPasswordService";
import { ILoginUserUseCase, LoginInput, LoginOutput } from "./interface/ILoginUserUseCase";



export class LoginUserUseCase implements ILoginUserUseCase{
    constructor(
        private readonly _userRepo : IUserRepository,
        private readonly _authService : IAuthService,
        private readonly _passwordService : IPasswordService
    ){}
    async execute({ email, password, role }: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this._userRepo.findByEmail(email);
            if(!user) {
                return {
                    status: HttpStatusCode.NOT_FOUND,
                    data: { error: 'Invalid email or password' }
                };
            }

            const isValid = await this._passwordService.comparePassword(password, user.password);
            if(!isValid) {
                return {
                    status: HttpStatusCode.BAD_REQUEST,
                    data: { error: "Invalid Credentials" }
                };
            }

            if(role[0] !== user.role){
                return {
                    status: HttpStatusCode.BAD_REQUEST,
                    data: { error: 'Access denied' }
                };
            }

            if(user.blocked) {
                return {
                    status: HttpStatusCode.BAD_REQUEST,
                    data: { error: "Your account has been blocked please contact support" }
                };
            }

            const token = this._authService.generateAccessToken({ id: user._id, role: user.role });
            const refreshToken = this._authService.generateRefreshToken({ id: user._id, role: user.role });

            return {
                status: HttpStatusCode.OK,
                data: {
                    user: {
                        id: user._id!,
                        name: user.name,
                        email: user.email,
                        role: user.role
                    },
                },
                token,
                refreshToken
            }
        } catch (error) {
            return {
                status: HttpStatusCode.INTERNAL_SERVER_ERROR,
                data: { error: error instanceof Error ? error.message : 'Unexpected error' }
            }
        }
    }

}




