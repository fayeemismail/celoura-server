import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../interfaces/repositories/IUserRepository";
import { IUserService } from "../../../domain/interfaces/IUserService";
import { AuthService } from "../../../infrastructure/service/AuthService";
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
    console.log(id)
    const user = await userRepository.getUserById(id);
    if (!user) throw new Error("User not found");
  
    // 👇 Check and update password if provided
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
  
      const authService = new AuthService();
      const hashed = await passwordService.hashPassword(newPassword);
      const result = await userRepository.updatePassword(id, hashed);
      console.log(`Password updated for user ${id}:`, result);
    }
  
    // 👇 Update name if provided
    if (name && name !== user.name) {
        validateNameUpdate(name)
      await userRepository.updateName(id, name);
      console.log(`Name updated for user ${id}`);
    }
  
    // ✅ Return latest user from DB
    const updatedUser = await userRepository.getUserById(id);
    return updatedUser!;
  };
  