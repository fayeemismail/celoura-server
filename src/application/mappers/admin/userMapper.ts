import { User } from "../../../domain/entities/User";
import { UserDTO } from "../../dto/admin/UserDTO";

export class UserMapper {
  static toDTO(user: User): UserDTO {
    return {
      _id: user._id,
      name: user.name,
      email: user.email,
      blocked: user.blocked,
      role: user.role,
      is_verified: user.is_verified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      googleUser: user.googleUser,
    };
  }

  static toDTOList(users: User[]): UserDTO[] {
    return users.map((u) => this.toDTO(u));
  }
}
