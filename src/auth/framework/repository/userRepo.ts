import userModel from "../model/userModel";
import { User } from "../../entities/User";

export const findByEmail = async ( email: string ): Promise< User | null > => {
    return await userModel.findOne( { email } )
};

export const createUser = async ( user: User ): Promise< User > => {
    return await userModel.create(user);
};

export const findAllUsers = async () => {
    return await userModel.find({ role: 'user' });
};