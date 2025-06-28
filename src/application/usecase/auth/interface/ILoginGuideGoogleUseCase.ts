import { User } from "../../../../domain/entities/User";


export interface ILoginGuideGoogleUseCase {
    execute(email: string, name: string): Promise<{guide: User, accessToken: string, refreshToken: string}>
}