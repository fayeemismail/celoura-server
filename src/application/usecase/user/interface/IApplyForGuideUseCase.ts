import { GuideApplication } from "../../../../domain/entities/GuideApplication";
import { GuideApplicationDto } from "../../../dto/user/GuideApplicationDTO";

export interface Input {
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  address: string;
  experience: string;
  expertise: string;
  idFileUrl: string;
  userId: string;
}

export interface IApplyForGuideUseCase {
  execute(input: GuideApplicationDto): Promise<GuideApplication>;
}
