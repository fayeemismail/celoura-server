import { JwtPayload } from "jsonwebtoken";





export interface IJwtService {
  verifyToken(token: string): JwtPayload | string;
  generateAccessToken(payload: object): string;
  generateRefreshToken(payload: object): string;
}