import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";

export class loginUserUseCase {
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