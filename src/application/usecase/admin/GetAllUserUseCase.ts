import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";




export class GetAllUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return  await this.userRepository.findAll();
    }
}