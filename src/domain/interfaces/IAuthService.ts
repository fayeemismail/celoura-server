

export interface IAuthService {
    hashPassword(password: string ): Promise<string>;
    comparePasswords(plain: string, hash: string): Promise<boolean>;
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
}