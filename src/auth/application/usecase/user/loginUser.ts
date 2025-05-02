import { IAuthService } from "../../../domain/interfaces/IAuthService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";



export const loginUser = async(
    email: string,
    password: string,
    userRepo: IUserRepository,
    authService: IAuthService
) => {
    const userData = await userRepo.findByEmail(email);
    if( !userData ) throw new Error('User not found');
    if(userData.blocked) throw new Error('User is Blocked');

    const isMatch = await authService.comparePasswords(password, userData.password);
    if( !isMatch ) throw new Error('Invalid credentials');
    
    const accessToken = authService.generateAccessToken({ id: userData._id, role: userData.role });
    const refreshToken = authService.generateRefreshToken({ id: userData._id, role: userData.role });

    const user = {
        id: userData._id,
        name: userData.name,
        email: userData.email,
        role: userData.role
    };

    return { user, token: accessToken, refreshToken };

}