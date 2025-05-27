import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { validateNameUpdate } from "../../validators/nameValidators";
import { validatePasswordUpdate } from "../../validators/passwordValidator";
import { PasswordService } from "../../../infrastructure/service/PasswordService";



interface EditProfileInput {
    id: string;
    name?: string;
    newPassword?: string;
    confirmPassword?: string;
    currentPassword?: string;
};

const passwordService = new PasswordService()

export const editProfile = async (
    input: EditProfileInput,
    userRepository: IUserRepository
  ): Promise<User> => {
    const { id, name, newPassword, currentPassword, confirmPassword } = input;
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("User not found");
  
    
    if (newPassword || confirmPassword || currentPassword) {
      if (!newPassword || !confirmPassword || !currentPassword) {
        throw new Error("All password fields (current, new, confirm) are required");
      }
  
      await validatePasswordUpdate({
        newPassword,
        confirmPassword,
        currentPassword,
        hashedPasswordInDb: user.password,
      });
  
      const hashed = await passwordService.hashPassword(newPassword);
      const result = await userRepository.updatePassword(id, hashed);
    }
  
    
    if (name && name !== user.name) {
        validateNameUpdate(name)
      await userRepository.updateName(id, name);
    }
  
    
    const updatedUser = await userRepository.getUserById(id);
    return updatedUser!;
  };
  