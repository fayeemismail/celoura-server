import { Destination } from "../../../domain/entities/Destination";
import { User } from "../../../domain/entities/User";
import { DestinationRepository } from "../../../infrastructure/database/repositories/DestinationRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetCountUseCase } from "./interface/IGetCountUseCase";



export class GetCountUseCase implements IGetCountUseCase {
    constructor( 
        private readonly _userRepo: IUserRepository,
        private readonly _destinationRepo: DestinationRepository
    ) {}
    async findUser(): Promise<User[]> {
        const allUser = await this._userRepo.findAll();
        return allUser.filter(user => user.role == 'user');     
    }

    async findGuide(): Promise<User[]> {
        const allUser = await this._userRepo.findAll();
        return allUser.filter(user => user.role == 'guide');
    }

    async findDestination(): Promise<Destination[]> {
        return this._destinationRepo.findAll()
    }
}