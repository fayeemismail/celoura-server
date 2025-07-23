import { FollowRequest } from "../../../application/dto/user/FollowGuideDts";
import FollowsModel from "../models/FollowsModel";
import guideModel from "../models/guideModel";
import { IFollowRepository } from "./interface/IFollowRepository";

export class FollowGuideRepository implements IFollowRepository {
  async followGuide(guideId: string, userId: string): Promise<void> {
    const alreadyFollowed = await FollowsModel.findOne({ userId, guideId });
    if (alreadyFollowed) {
      return; 
    }

    await FollowsModel.create({
      userId,
      guideId,
      followedAt: new Date(),
    });

    await guideModel.updateOne(
      { user: guideId },
      { $addToSet: { followers: userId } } 
    );
  }

  async unfollowGuide(guideId: string, userId: string): Promise<void> {
      await FollowsModel.deleteOne({ userId, guideId });

      await guideModel.updateOne(
        { user: guideId },
        { $pull: { followers: userId } }
      );
  }
}
