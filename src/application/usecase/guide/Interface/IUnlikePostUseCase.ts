


export interface IUnlikePostUseCase{
    execute(postId: string, userId: string): Promise<void>;
}