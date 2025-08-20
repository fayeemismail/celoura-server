import cloudinary from "../../../config/cloudinaryConfig";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { GuideEditProfileDTO } from "../../dto/guide/guideEditProfileData";
import { IPasswordService } from "../../interfaces/services/IPasswordService";
import { validateNameUpdate } from "../../validators/nameValidators";
import { validatePasswordUpdate } from "../../validators/passwordValidator";
import { IEditGuideProfileUseCase } from "./Interface/IEditGuideProfileUseCase";

export class EditGuideProfileUseCase implements IEditGuideProfileUseCase {
  constructor(
    private readonly _userRepo: IUserRepository,
    private readonly _passwordService: IPasswordService
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
      availableDestinations
    } = data;

    if (!_id) throw new Error("_id is missing");

    const guideUser = await this._userRepo.getUserById(_id);
    const guide = await this._userRepo.getGuideById(_id);
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

      const hashed = await this._passwordService.hashPassword(newPassword);
      await this._userRepo.updatePassword(_id, hashed);
    }

    // Handle name update
    if (name && name !== guideUser.name) {
      validateNameUpdate(name);
      await this._userRepo.updateName(_id, name);
    }

    // Handle bio update
    if (bio !== undefined && bio !== guide.bio) {
      await this._userRepo.updateGuideBio(_id, bio.trim());
    }

    // Handle available destinations update
    if (availableDestinations !== undefined) {
      let destinationsArray: string[] = [];
      
      // Parse if it's a string (coming from form data)
      if (typeof availableDestinations === 'string') {
        try {
          destinationsArray = JSON.parse(availableDestinations);
        } catch (error) {
          console.error("Failed to parse availableDestinations:", error);
          throw new Error("Invalid destinations format");
        }
      } else if (Array.isArray(availableDestinations)) {
        destinationsArray = availableDestinations;
      }
      
      // Validate each destination is a non-empty string
      if (destinationsArray.some(dest => typeof dest !== 'string' || !dest.trim())) {
        throw new Error("Destinations must be non-empty strings");
      }

      // Remove duplicates
      const uniqueDestinations = [...new Set(destinationsArray.map(d => d.trim()))];
      
      await this._userRepo.updateGuideAvailableDestinations(_id, uniqueDestinations);
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
        await this._userRepo.updateGuideProfilePic(_id, "");
      } catch (error) {
        console.error("❌ Failed to delete profile pic from Cloudinary:", error);
        throw new Error("Failed to delete profile picture from Cloudinary");
      }
    }

    // Handle profile picture update
    if (profilePic) {
      await this._userRepo.updateGuideProfilePic(_id, profilePic.path);
    }

    return { message: "Profile updated successfully" };
  }
}