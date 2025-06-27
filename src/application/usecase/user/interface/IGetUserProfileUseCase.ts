import { User } from "../../../../domain/entities/User";



export interface IGetUserProfile {
    execute(id: string): Promise<User>
}