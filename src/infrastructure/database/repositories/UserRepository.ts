import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";
import userModel from "../models/userModel";


export class UserRepository implements IUserRepository {

    async findByEmail(email: string): Promise<User | null> {
        return userModel.findOne({email});
    }

    async createUser(data: Partial<User>): Promise<User> {
        const user = new userModel(data);
        return user.save();
    }
    
    async getUserById(_id: string): Promise<User | null> {
        return userModel.findById(_id)
    }

    async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
        const updated = await userModel.findByIdAndUpdate(
            userId,
            { $set: updateData },
            { new: true, lean: true }
        )
        if(!updated) {
            throw new Error("User not found or update fail")
        }

        return updated;
    };

    async updatePassword(usreId: string, hashedPassword: string): Promise<void> {
        await userModel.findByIdAndUpdate(usreId, { password: hashedPassword });
    };

    async updateName(userId: string, name: string): Promise<void> {
        await userModel.findByIdAndUpdate(userId, {name: name});
    };

    async findAll(): Promise<User[]> {
        return await userModel.find({ role: 'user' });
    };


}