import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { AuthService } from "../../../infrastructure/service/AuthService";
import { PasswordService } from "../../../infrastructure/service/PasswordService";
import { HttpStatusCode } from "../../constants/httpStatus";

const userRepo = new UserRepository();
const authService = new AuthService();
const passwordService = new PasswordService();

interface LoginInput {
    email: string;
    password: string;
    role: string[];
};

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
    } catch (error: any) {
        console.log(error.message)
        return { status: HttpStatusCode.INTERNAL_SERVER_ERROR, data: { error: error.message } };
    }
}