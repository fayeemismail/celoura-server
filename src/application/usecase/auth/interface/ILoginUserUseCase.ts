import { User } from "../../../../domain/entities/User";


export interface ILoginUserUseCase {
    execute(email: string, name: string): Promise<User>;
}