import { User } from "../entities/User";


export interface IUserService {
    editProfile: (userId: string, updateData: Partial<User>) => Promise<User>;
};