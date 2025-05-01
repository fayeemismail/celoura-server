import { User } from "../entities/User";


export interface IUserRepository {
    findByEmail(email: string): Promise< User | null >;
    createUser(data: Partial<User>) : Promise<User>;
}