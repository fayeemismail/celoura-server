import { User } from "../../../../domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(data: Partial<User>): Promise<User>;
  getUserById(_id: string): Promise<User | null>;
  updateProfile(userId: string, updateData: Partial<User>): Promise<User>;
  updatePassword(usreId: string, hashedPassword: string): Promise<void>;
  updateName(userId:string, name: string): Promise<void>;
  findAll(): Promise<User[]>;
  blockUser(userId: string): Promise<any>;
  unBlockUser(userId: string): Promise<any>;
  approveAsGuide(userId: string): Promise<any>;
  rejectAsGuide(userId: string): Promise<any>;
  findAllPaginated(page: number, limit: number, role: string): Promise<{ data: User[]; total: number }>;
}
