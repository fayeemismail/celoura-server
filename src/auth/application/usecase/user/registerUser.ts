import { IAuthService } from "../../../domain/interfaces/IAuthService";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";



export const registerUser = async ( 
    name: string,
    email: string,
    password: string,
    role: string,
    userRepo: IUserRepository, 
    authService: IAuthService
 ) => {

    const hashed = await authService.hashPassword(password)
    
    
    if (!["user", "guide", "admin"].includes(role)) {
        throw new Error("Invalid role");
    }
    
    const userRole = role as "user" | "guide" | "admin";

    const user = { 
        name, 
        email,
        password: hashed, 
        role : userRole, 
        blocked: false,
        is_verified: false, 
    };

    const savedUser = await userRepo.createUser(user)

    return savedUser

}