


export interface IRefreshAccessTokenUseCase {
    execute(refreshToken: string): Promise<{ accessToken: string, userId: string }>
}