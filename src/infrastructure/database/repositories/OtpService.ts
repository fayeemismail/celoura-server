import Redis from "ioredis";
import { IOtpRepository } from "../../../domain/interfaces/IOtpRepository";

const redis = new Redis();

export class OtpRepository implements IOtpRepository {
    async setOtp(key: string, otp: string): Promise<void> {
        await redis.set(key, otp, 'EX', 90);
    }

    async getOtp(key: string): Promise<string | null> {
        return await redis.get(key);
    }

    async deleteOtp(key: string): Promise<void> {
        await redis.del(key)
    }

    async setTempUser(email: string, userData: object): Promise<void> {
        await redis.set(`tempuser:${email}`, JSON.stringify(userData), 'EX', 600)
    }

    async getTempUser(email: string): Promise<any | null> {
        const data = await redis.get(`tempuser:${email}`);
        return data ? JSON.parse(data): null;
    }

    async deleteTempUser(email: string): Promise<void> {
        await redis.del(`tempuser:${email}`)
    };

    // async getforgotOtp(email: string): Promise<string | null> {
    //     return await redis.get(`forgot:${email}`)
    // }
}