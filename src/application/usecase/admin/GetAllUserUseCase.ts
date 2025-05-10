import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../domain/interfaces/IUserRepository";




export class GetAllUserUseCase {
    constructor(private userRepository: IUserRepository) {}

    async execute(): Promise<User[]> {
        return  await this.userRepository.findAll();
    }
}