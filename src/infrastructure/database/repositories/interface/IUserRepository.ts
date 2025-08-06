import { Comments } from "../../../../domain/entities/CommentEntity";
import { Guide } from "../../../../domain/entities/Guide";
import { Likes } from "../../../../domain/entities/LikeEntitiy";
import { User } from "../../../../domain/entities/User";

export interface IUserRepository {
  findByEmail(email: string): Promise<User | null>;
  createUser(data: Partial<User>): Promise<User>;
  getUserById(_id: string): Promise<User | null>;
  updateProfile(userId: string, updateData: Partial<User>): Promise<User>;
  updatePassword(usreId: string, hashedPassword: string): Promise<void>;
  updateName(userId: string, name: string): Promise<void>;
  findAll(): Promise<User[]>;
  blockUser(userId: string): Promise<any>;
  unBlockUser(userId: string): Promise<any>;
  approveAsGuide(userId: string): Promise<any>;
  rejectAsGuide(userId: string): Promise<any>;
  findAllPaginated(page: number, limit: number, role: string, search: string): Promise<{ data: User[]; total: number }>;
  getGuideById(id: string): Promise<Guide | null>;
  updateGuideProfilePic(userId: string, profilePicUrl: string): Promise<void>;
  updateGuideBio(userId: string, bio: string): Promise<void>;
  getLikesByPostId(postId: string): Promise<Likes[]>;
  getCommentsByPostId(postId: string): Promise<Comments[]>;
  reApproveAsGuide(userId: string): Promise<User | null>;
}
