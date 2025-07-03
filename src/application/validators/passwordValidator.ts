import { ValidationError } from "../../utils/ValidationError";
import { PasswordService } from "../../infrastructure/service/PasswordService";

interface PasswordValidationInput {
  newPassword: string;
  confirmPassword: string;
  currentPassword: string;
  hashedPasswordInDb: string;
}

export const validatePasswordUpdate = async ({
  newPassword,
  confirmPassword,
  currentPassword,
  hashedPasswordInDb,
}: PasswordValidationInput): Promise<void> => {
  const errors: string[] = [];

  if (!hashedPasswordInDb) {
    throw new Error("Stored password is missing.");
  }

  
  if (/\s/.test(newPassword) || /\s/.test(confirmPassword)) {
    errors.push("Password cannot contain spaces.");
  }

  const meetsLength = newPassword.length >= 8;
  const hasUppercase = /[A-Z]/.test(newPassword);
  const hasLowercase = /[a-z]/.test(newPassword);
  const hasNumber = /\d/.test(newPassword);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

  if (!(meetsLength && hasUppercase && hasLowercase && hasNumber && hasSpecial)) {
    errors.push(
      "Password must be at least 8 characters and include uppercase, lowercase, number, and special character."
    );
  }

  if (currentPassword === confirmPassword) {
    errors.push('Current Password and new Password are same.');
  }

  if (newPassword !== confirmPassword) {
    errors.push("Password and confirm password do not match.");
  }

  const passwordService = new PasswordService();
  const isCurrentPasswordValid = await passwordService.comparePassword(currentPassword, hashedPasswordInDb);
  if (!isCurrentPasswordValid) {
    errors.push("Current password is incorrect.");
  }

  if (errors.length > 0) {
    throw new ValidationError(errors.join(" "));
  }
};
