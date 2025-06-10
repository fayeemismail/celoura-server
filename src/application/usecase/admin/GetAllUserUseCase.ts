import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";




export class GetAllUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(page: number, limit: number, role: 'user' | 'guide'): Promise<{ data: User[]; total: number }> {
        return await this.userRepository.findAllPaginated(page, limit, role);
    }
    async find() : Promise<any> {
        return await this.userRepository.findAll()
    }
}