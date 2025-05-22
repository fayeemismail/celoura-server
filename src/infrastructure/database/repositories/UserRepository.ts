import { User } from "../../../domain/entities/User";
import { IUserRepository } from "./interface/IUserRepository";
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
        return await userModel.find({ role: { $in: ['user' , 'guide'] } });
    };

    async blockUser(userId: string): Promise<User> {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { blocked: true },
            { new: true }
        );
        if(!user) {
            throw new Error("User not found")
        };
        const userData = user.toObject();
        return {
            ...userData,
            _id: userData._id.toString()
        };
    };

    async unBlockUser(userId: string): Promise<User> {
        const user = await userModel.findByIdAndUpdate(
            userId,
            { blocked: false },
            { new: true }
        );
        if(!user) {
            throw new Error("User not found");
        };
        const userData = user.toObject();
        return {
            ...userData,
            _id: userData._id.toString()
        }
    };

}