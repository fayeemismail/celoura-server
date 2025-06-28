import { User } from "../../../../domain/entities/User";


export interface IRegisterGoogleUseCase {
    execute(email: string, name: string): Promise<{ user: User; accessToken: string; refreshToken: string;}>;
}