import cloudinary from "../../../config/cloudinaryConfig";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { PasswordService } from "../../../infrastructure/service/PasswordService";
import { GuideEditProfileDTO } from "../../dto/guide/guideEditProfileData";
import { GuideWithUserData } from "../../dto/guide/guideProfileDto";
import { validateNameUpdate } from "../../validators/nameValidators";
import { validatePasswordUpdate } from "../../validators/passwordValidator";
import {
  IEditGuideProfileUseCase,
  successEditProfile,
} from "./Interface/IEditGuideProfileUseCase";

export class EditGuideProfileUseCase implements IEditGuideProfileUseCase {
  constructor(
    private readonly userRepo: IUserRepository,
    private readonly passwordService: PasswordService
  ) { }

  async execute(data: GuideEditProfileDTO): Promise<any> { 
    const {
      _id,
      name,
      bio,
      currentPassword,
      newPassword,
      confirmPassword,
      profilePic,
      removeProfilePic,
    } = data;

    if (!_id) throw new Error("_id is missing");

    const guideUser = await this.userRepo.getUserById(_id);
    const guide = await this.userRepo.getGuideById(_id);
    if (!guide || !guideUser) throw new Error("Guide not found");

    // Handle password update
    if (newPassword || confirmPassword || currentPassword) {
      if (!newPassword || !currentPassword || !confirmPassword) {
        throw new Error("All password fields (current, new, confirm) are required");
      }

      await validatePasswordUpdate({
        newPassword,
        confirmPassword,
        currentPassword,
        hashedPasswordInDb: guideUser.password,
      });

      const hashed = await this.passwordService.hashPassword(newPassword);
      await this.userRepo.updatePassword(_id, hashed);
    }

    // Handle name update
    if (name && name !== guideUser.name) {
      validateNameUpdate(name);
      await this.userRepo.updateName(_id, name);
    }

    // Handle bio update
    if (bio !== undefined && bio !== guide.bio) {
      await this.userRepo.updateGuideBio(_id, bio.trim());
    }


    // Handle profile picture removal
    if (removeProfilePic && guide.profilePic) {
      try {
        const url = guide.profilePic;
        const segments = url.split("/");
        const fileWithExt = segments[segments.length - 1];
        const decodedFile = decodeURIComponent(fileWithExt);
        const fileNameWithoutExt = decodedFile.replace(/\.[^/.]+$/, "");
        const publicId = `guide_profiles/${fileNameWithoutExt}`;

        const result = await cloudinary.uploader.destroy(publicId);
        await this.userRepo.updateGuideProfilePic(_id, "");
      } catch (error) {
        console.error("❌ Failed to delete profile pic from Cloudinary:", error);
        throw new Error("Failed to delete profile picture from Cloudinary");
      }
    }

    // Handle profile picture update
    if (profilePic) {
      await this.userRepo.updateGuideProfilePic(_id, profilePic.path);
    }

    return { message: "Profile updated successfully" };
  }
}
