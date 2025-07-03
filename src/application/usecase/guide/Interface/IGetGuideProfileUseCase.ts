import { User } from "../../../../domain/entities/User";
import { GuideWithUserData } from "../../../dto/guide/guideProfileDto";







export interface IGetGuideProfile {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<GuideWithUserData | null>;
    getMe(id: string): Promise<User>
}