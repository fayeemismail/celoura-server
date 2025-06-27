import { User } from "../../../../domain/entities/User";
import { EditProfileInput } from "../../../dto/user/EditProfileInput";



export interface IEditUserProfileUseCase {
    execute(data: EditProfileInput): Promise<User>
}