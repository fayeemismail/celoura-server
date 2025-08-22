import { GuideDto } from "./GuideDto";

// domain/dtos/GuideApplicationDto.ts
export interface GuideApplicationDto {
  fullName: string;
  email: string;
  phone: string;
  dob: Date;
  address: string;
  experience: string;
  expertise: string;
  idFileUrl: string;
  profilePhotoUrl: string;
  userId: string;
  basedOn: string;
};


export interface GuidePaginatedReturnDTO {
    data: GuideDto[];
    total: number
};