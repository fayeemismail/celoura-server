import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { AuthService } from "../../../infrastructure/service/AuthService";
import { PasswordService } from "../../../infrastructure/service/PasswordService";
import { extractErrorMessage } from "../../../utils/errorHelpers";
import { HttpStatusCode } from "../../constants/httpStatus";
import { ILoginUserUseCase, LoginInput, LoginOutput } from "./interface/ILoginUserUseCase";



export class LoginUserUseCase implements ILoginUserUseCase{
    constructor(
        private readonly userRepo : IUserRepository,
        private readonly authService : AuthService,
        private readonly passwordService : PasswordService
    ){}
    async execute({ email, password, role }: LoginInput): Promise<LoginOutput> {
        try {
            const user = await this.userRepo.findByEmail(email);
            if(!user) {
                return {
                    status: HttpStatusCode.NOT_FOUND,
                    data: { error: 'Invalid email or password' }
                };
            }

            const isValid = await this.passwordService.comparePassword(password, user.password);
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

            const token = this.authService.generateAccessToken({ id: user._id, role: user.role });
            const refreshToken = this.authService.generateRefreshToken({ id: user._id, role: user.role });

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



const userRepo = new UserRepository();
const authService = new AuthService();
const passwordService = new PasswordService();


export const login = async ({ email, password, role }: LoginInput) => {
    try {
        const user = await userRepo.findByEmail(email);
        if(!user) return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'Invalid email or password' } };

        const isValid = await passwordService.comparePassword(password, user.password);
        if(!isValid) return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'Invalid Credentials' } };

        if(role[0] !== user.role) return { status: HttpStatusCode.BAD_REQUEST, data: { error: 'Access denied' } };

        if(user.blocked) return { status: HttpStatusCode.BAD_REQUEST, data:{ error: 'Your account has been blocked please contact support' } }

        const token = authService.generateAccessToken( { id: user._id, role: user.role } );
        const refreshToken = authService.generateRefreshToken({ id: user._id, role: user.role });

        return {
            status: HttpStatusCode.OK,
            data: {
                user: { id: user._id, name: user.name, email: user.email, role: user.role }
            },
            token,
            refreshToken,
        }
    } catch (error: unknown) {
        const message = extractErrorMessage(error);
        console.log(message, 'on Login User.ts')
        return { status: HttpStatusCode.INTERNAL_SERVER_ERROR, data: { error: message || "Something went wrong on login" } };
    }
}
