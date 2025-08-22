import { GuideEditProfileDTO } from "../../../dto/guide/guideEditProfileData";
import { GuideWithUserData } from "../../../dto/guide/guideProfileDto";


export interface successEditProfile {
    message: string;
}

export interface IEditGuideProfileUseCase {
    execute(data: GuideEditProfileDTO): Promise<successEditProfile>;
}