import { User } from "../../../../domain/entities/User";


export interface ILoginGuideGoogleUseCase {
    execute(email: string, name: string): Promise<User>
}