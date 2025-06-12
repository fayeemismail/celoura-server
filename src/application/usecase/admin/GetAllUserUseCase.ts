import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";




export class GetAllUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(page: number, limit: number, role: 'user' | 'guide', search: string): Promise<{ data: User[]; total: number }> {
        return await this.userRepository.findAllPaginated(page, limit, role, search);
    }
    async find() : Promise<any> {
        return await this.userRepository.findAll()
    }
}