// usecases/ApplyForGuideUseCase.ts
import { GuideApplication } from "../../../domain/entities/GuideApplication";
import { IGuideApplicationRepository } from "../../../infrastructure/database/repositories/interface/IGuideApplicationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IApplyForGuideUseCase } from "./interface/IApplyForGuideUseCase";
import { GuideApplicationDto } from "../../../application/dto/user/GuideApplicationDTO";

export class ApplyForGuideUseCase implements IApplyForGuideUseCase {
  constructor(
    private _guideRepo: IGuideApplicationRepository,
    private _userRepo: IUserRepository
  ) { }

  async execute(input: GuideApplicationDto): Promise<GuideApplication> {
    const { 
      fullName, 
      phone, 
      email, 
      dob, 
      address, 
      experience, 
      expertise, 
      idFileUrl, 
      profilePhotoUrl, 
      userId, 
      basedOn 
    } = input;

    const user = await this._userRepo.getUserById(userId);
    if (!user) throw new Error('User not found');
    if (user.email !== email) throw new Error('Email mismatch');

    const existingApplication = await this._guideRepo.findUser(userId);
    const now = new Date();

    if (existingApplication) {
      const isRejected = existingApplication.status === 'rejected' && existingApplication.rejectReason;
      const isOldPending = existingApplication.status === 'pending' &&
        new Date(existingApplication.createdAt).getTime() < now.getTime() - 7 * 24 * 60 * 60 * 1000;

      if (isRejected || isOldPending) {
        const reApplyCount = (existingApplication.re_apply ?? 0) + 1;
        const previousRejectReason = existingApplication.rejectReason;

        await this._guideRepo.deleteApplicationById(existingApplication._id);

        const newApplication = await this._guideRepo.createApplication({
          fullName,
          phone,
          email,
          dob,
          address,
          experience,
          expertise,
          idFileUrl,
          profilePhotoUrl,
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

    const existingEmail = await this._guideRepo.findUserByEmail(email);
    if (existingEmail) throw new Error('The email is already used');

    const newApplication = await this._guideRepo.createApplication({
      fullName,
      phone,
      email,
      dob,
      address,
      experience,
      expertise,
      idFileUrl,
      profilePhotoUrl,
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