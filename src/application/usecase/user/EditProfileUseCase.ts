import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { validateNameUpdate } from "../../validators/nameValidators";
import { validatePasswordUpdate } from "../../validators/passwordValidator";
import { IEditUserProfileUseCase } from "./interface/IEditUserProfileUseCase";
import { EditProfileInput } from "../../dto/user/EditProfileInput";
import { IPasswordService } from "../../interfaces/services/IPasswordService";



export class EditProfile implements IEditUserProfileUseCase { 
  constructor(
    private readonly userRepo : IUserRepository,
    private readonly passwordService: IPasswordService
  ) {}
  async execute(data: EditProfileInput): Promise<User> {
    const { id, name, newPassword, confirmPassword, currentPassword } = data;
    console.log(data, 'this is data')
    const user = await this.userRepo.getUserById(id);
    if(!user) throw new Error( "User not found" );

    if( newPassword || confirmPassword || currentPassword ){
      if( !newPassword || !confirmPassword || !currentPassword ){
        throw new Error("All password (current, new, confirm) are required");
      }
      await validatePasswordUpdate({
        newPassword,
        confirmPassword,
        currentPassword,
        hashedPasswordInDb: user.password
      });

      const hashed = await this.passwordService.hashPassword(newPassword);
      await this.userRepo.updatePassword(id, hashed)
    };

    if(name && name !== user.name){
      validateNameUpdate(name);
      await this.userRepo.updateName(id, name)
    }

    const upadatedUser = await this.userRepo.getUserById(id);
    return upadatedUser!;
  }
}