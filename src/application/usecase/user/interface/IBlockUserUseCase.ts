

export interface IBlockUserUseCase {
    execute(id: string): Promise<void>;
}