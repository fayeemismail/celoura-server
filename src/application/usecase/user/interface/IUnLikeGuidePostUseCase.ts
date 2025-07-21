


export interface IUnLikeGuidePostUseCase {
    execute(postId: string, userId: string): Promise<void>;
}