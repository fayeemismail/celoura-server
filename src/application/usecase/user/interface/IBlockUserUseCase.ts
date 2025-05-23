

export interface IBlockUserUseCase {
    execute(userId: string): Promise<void>;
}