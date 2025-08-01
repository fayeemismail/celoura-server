import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";




export class GetAllGuidesUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        console.log('hey it happend')
        return await this.userRepository.findAll()
    }
}