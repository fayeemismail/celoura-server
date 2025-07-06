import Redis from "ioredis";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";

const redis = new Redis();

export class OtpRepository implements IOtpRepository {
    async setOtp(email: string, otp: string): Promise<void> {
        await redis.set(`otp:${email}`, otp, 'EX', 90);
    }

    async getOtp(email: string): Promise<string | null> {
        return await redis.get(`otp:${email}`);
    }

    async deleteOtp(email: string): Promise<void> {
        await redis.del(`otp:${email}`)
    }

    async setTempUser(email: string, userData: object): Promise<void> {
        await redis.set(`tempuser:${email}`, JSON.stringify(userData), 'EX', 600)
    }

    async getTempUser(email: string): Promise<any | null> {
        const data = await redis.get(`tempuser:${email}`);
        console.log(data, 'this is getTempUser')
        return data ? JSON.parse(data): null;
    }

    async deleteTempUser(email: string): Promise<void> {
        await redis.del(`tempuser:${email}`)
    }
}