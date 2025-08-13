import { User } from "../../../domain/entities/User";
import { IUserRepository } from "./interface/IUserRepository";
import { BaseRepository } from "./BaseRepository";
import userModel from "../models/userModel";
import guideModel from "../models/guideModel";
import { Guide } from "../../../domain/entities/Guide";
import CommentsModel from "../models/CommentsModel";
import LikesModel from "../models/LikesModel";

export class UserRepository extends BaseRepository<User> implements IUserRepository {
  constructor() {
    super(userModel);
  }

  async findByEmail(email: string): Promise<User | null> {
    return userModel.findOne({ email });
  }

  async getUserById(_id: string): Promise<User | null> {
      return userModel.findById(_id)
  }

  async createUser(data: Partial<User>): Promise<User> {
    const user = new userModel(data);
    return user.save();
  }

  async updateProfile(userId: string, updateData: Partial<User>): Promise<User> {
    const updated = await userModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, lean: true }
    );
    if (!updated) {
      throw new Error("User not found or update fail");
    }
    return updated;
  }

  async updatePassword(userId: string, hashedPassword: string): Promise<void> {
    await userModel.findByIdAndUpdate(userId, { password: hashedPassword });
  }

  async updateName(userId: string, name: string): Promise<void> {
    await userModel.findByIdAndUpdate(userId, { name });
  }

  async findAll(): Promise<User[]> {
    return await userModel.find({ role: { $in: ['user', 'guide'] } });
  }

  async blockUser(userId: string): Promise<any> {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { blocked: true },
      { new: true }
    );
    if (!user) throw new Error("User not found");

    return { ...user.toObject(), _id: user._id.toString() };
  }

  async unBlockUser(userId: string): Promise<any> {
    const user = await userModel.findByIdAndUpdate(
      userId,
      { blocked: false },
      { new: true }
    );
    if (!user) throw new Error("User not found");

    return { ...user.toObject(), _id: user._id.toString() };
  }

  async approveAsGuide(userId: string): Promise<User | null> {
    return await userModel.findByIdAndUpdate(userId, { role: 'guide' }, { new: true });
  }

  async rejectAsGuide(userId: string): Promise<User | null> {
    return await userModel.findByIdAndUpdate(userId, { role: 'user' }, { new: true });
  }

  async findAllPaginated(
    page: number,
    limit: number,
    role: string,
    search: string
  ): Promise<{ data: User[]; total: number }> {
    const skip = (page - 1) * limit;
    const query: any = { role };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [data, total] = await Promise.all([
      userModel
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),
      userModel.countDocuments(query),
    ]);

    return { data, total };
  }

  async getGuideById(id: string): Promise<Guide | null> {
    return await guideModel.findOne({ user: id });
  }

  async updateGuideProfilePic(userId: string, profilePicUrl: string): Promise<void> {
    await guideModel.updateOne({ user: userId }, { profilePic: profilePicUrl });
  }

  async updateGuideBio(userId: string, bio: string): Promise<void> {
    await guideModel.updateOne({ user: userId }, { bio });
  }

  async getLikesByPostId(postId: string) {
    return LikesModel.find({ postId });
  }

  async getCommentsByPostId(postId: string) {
    return CommentsModel.find({ postId })
      .populate("userId", "name profilePic")
      .lean();
  }

  async reApproveAsGuide(userId: string): Promise<User | null> {
    return await userModel.findByIdAndUpdate(userId, { role: 'guide' }, { new: true });
  }

  async updateGuideAvailableDestinations(
    guideId: string,
    destinations: string[]
  ): Promise<void> {
    await guideModel.findOneAndUpdate(
      { user: guideId },
      { availableDestinations: destinations }
    );
  }
}
