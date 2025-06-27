import { Destination } from "../../../../domain/entities/Destination";
import { User } from "../../../../domain/entities/User";



export interface IGetCountUseCase {
    findUser(): Promise<User[]>;
    findGuide(): Promise<User[]>;
    findDestination(): Promise<Destination[]>;
}