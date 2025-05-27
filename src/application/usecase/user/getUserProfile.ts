import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository"



export const getUserProfile = async (
    id: string,
    userRepo: IUserRepository
) => {
    const userData = await userRepo.getUserById(id);
    if (!userData) throw new Error('User not found');
    if( userData.blocked ) throw new Error('User is blocked');
    const user = {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        isBlocked: userData.blocked
    }
    return user
}