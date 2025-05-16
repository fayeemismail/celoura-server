export interface IJwtService {
  verifyToken(token: string): any;
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
}