import { User } from "../../../../domain/entities/User";


export interface IGetGuideProfile {
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User | null>;
    getMe(id: string): Promise<User>
}