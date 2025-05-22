import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { GuideApplicationRepository } from "../../../infrastructure/database/repositories/GuideApplicationRepository";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";
import { IGuideApplicationRepository } from "../../interfaces/repositories/IGuideApplicationRepository";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";




interface Input {
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  address: string;
  experience: string;
  expertise: string;
  idFileUrl: string;
  status: string;
  userId: string;
}


export class ApplyForGuideUseCase {
    private guideRepo: GuideApplicationRepository;
    private userRepo: UserRepository
    constructor() {
        this.guideRepo = new GuideApplicationRepository();
        this.userRepo = new UserRepository();
    }

    async execute(input: Input): Promise<GuideApplication>  {
        const { fullName, phone, email, dob, address, experience, expertise, idFileUrl, status, userId } = input;
        
        const user = await this.userRepo.getUserById(userId);
        if(!user) throw new Error('User not found');
        if(user.email !== email) throw new Error('Email mismatch: The provided email does not match the user account');

        const existingApplication = await this.guideRepo.findUser(userId);
        if(existingApplication) throw new Error('Already Applied! Cannot apply More than once');

        const existingEmail = await this.guideRepo.findUserByEmail(email)
        if(existingEmail) throw new Error('The email is already used');
        
        const guideApplication = await this.guideRepo.createApplication({
            fullName,
            phone,
            email,
            dob,
            address,
            experience,
            expertise,
            idFileUrl,
            status,
            userId,
            createdAt: new Date(),
            updatedAt: new Date()
        })
        return guideApplication
    }
}