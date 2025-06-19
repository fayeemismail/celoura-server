import { User } from "../../../domain/entities/User";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IGetAllUserUseCase } from "./interface/IGetAllUserUseCase";




export class GetAllUserUseCase implements IGetAllUserUseCase {
    constructor(private userRepository: IUserRepository) { }

    async execute(page: number, limit: number, role: 'user' | 'guide', search: string): Promise<{ data: User[]; total: number }> {
        return await this.userRepository.findAllPaginated(page, limit, role, search);
    }
    async find() : Promise<User[]> {
        return await this.userRepository.findAll()
    }
}