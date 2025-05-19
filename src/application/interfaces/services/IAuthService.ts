

export interface IAuthService {
    generateAccessToken(payload: object): string;
    generateRefreshToken(payload: object): string;
    verifyRefreshToken(token: string): any;
}