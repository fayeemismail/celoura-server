import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import userModel from "../models/userModel";


export class UserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        return userModel.findOne({email});
    }

    async createUser(data: Partial<User>): Promise<User> {
        const user = new userModel(data);
        return user.save()
    }
    
    async getUserById(_id: string): Promise<User | null> {
        return userModel.findById(_id)
    }

}