import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IApplyForGuideUseCase } from "./interface/IApplyForGuideUseCase";




interface Input {
    fullName: string;
    email: string;
    phone: string;
    dob: Date;
    address: string;
    experience: string;
    expertise: string;
    idFileUrl: string;
    userId: string;
    basedOn: string;
}


export class ApplyForGuideUseCase implements IApplyForGuideUseCase {

    constructor(
        private guideRepo: IGuideApplicationRepository,
        private userRepo: IUserRepository
    ) { }

    async execute(input: Input): Promise<GuideApplication> {
        const { fullName, phone, email, dob, address, experience, expertise, idFileUrl, userId, basedOn } = input;

        const user = await this.userRepo.getUserById(userId);
        if (!user) throw new Error('User not found');
        if (user.email !== email) throw new Error('Email mismatch');

        const existingApplication = await this.guideRepo.findUser(userId);
        const now = new Date();

        if (existingApplication) {
            const isRejected = existingApplication.status === 'rejected' && existingApplication.rejectReason;
            const isOldPending = existingApplication.status === 'pending' &&
                new Date(existingApplication.createdAt).getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000;

            if (isRejected || isOldPending) {
                const reApplyCount = (existingApplication.re_apply ?? 0) + 1;
                const previousRejectReason = existingApplication.rejectReason;

                await this.guideRepo.deleteApplicationById(existingApplication._id); // you’ll need _id in GuideApplication

                const newApplication = await this.guideRepo.createApplication({
                    fullName,
                    phone,
                    email,
                    dob,
                    address,
                    experience,
                    expertise,
                    idFileUrl,
                    status: 'pending',
                    userId,
                    basedOn,
                    rejectReason: previousRejectReason ?? "",
                    re_apply: reApplyCount,
                    createdAt: now,
                    updatedAt: now
                });

                return newApplication;
            }

            throw new Error('You have already applied and cannot re-apply yet.');
        }

        const existingEmail = await this.guideRepo.findUserByEmail(email);
        if (existingEmail) throw new Error('The email is already used');

        const newApplication = await this.guideRepo.createApplication({
            fullName,
            phone,
            email,
            dob,
            address,
            experience,
            expertise,
            idFileUrl,
            status: 'pending',
            userId,
            basedOn,
            rejectReason: "",
            re_apply: 0,
            createdAt: now,
            updatedAt: now
        });

        return newApplication;
    }

}