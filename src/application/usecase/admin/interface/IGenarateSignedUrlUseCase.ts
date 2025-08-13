


export interface IGenerateSignedUrlUseCase {
    execute(photoCount: number): Promise<{ url: string; key: string }[]>;
}