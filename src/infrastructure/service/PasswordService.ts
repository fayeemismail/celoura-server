import bcrypt from 'bcrypt';
import { IPasswordService } from "../../application/interfaces/services/IPasswordService";


const SALT_ROUNDS = 10

export class PasswordService implements IPasswordService {
    async hashPassword(password: string): Promise<string> {
        console.log(password, 'this i password')
        return bcrypt.hash(password, SALT_ROUNDS);
    }

    async comparePassword(plain: string, hash: string): Promise<boolean> {
        return bcrypt.compare(plain, hash);
    }
};