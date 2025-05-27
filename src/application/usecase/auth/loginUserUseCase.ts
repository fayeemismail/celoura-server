import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { ILoginUserUseCase } from "./interface/ILoginUserUseCase";

export class loginUserUseCase implements ILoginUserUseCase {
    private userRepo: UserRepository;

    constructor() {
        this.userRepo = new UserRepository();
    }

    async execute(email: string, name: string): Promise<User> {
        if(!email) throw new Error ("Invalid Email");

        let user = await this.userRepo.findByEmail(email);
        if(user?.blocked){
            return user;
        }

        if(user?.role == 'guide') throw new Error('Access denied');
        if(user?.role == 'admin') throw new Error('Access denied');

        if(!user){
            user = await this.userRepo.createUser({
                name,
                email,
                password: '',
                blocked: false,
                role: 'user',
                googleUser: true,
                createdAt: new Date(),
                updatedAt: new Date()
            });
        }
        return user;
    }
}