import { User } from "../../../../domain/entities/User";


export interface IGetAllUserUseCase {
    execute(page: number, limit: number, role: string, search: string): Promise<{data: User[]; total: number}>
    find(): Promise<User[]>
}