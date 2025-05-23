import { Request, Response, NextFunction } from 'express';
import { UserRepository } from '../../infrastructure/database/repositories/UserRepository';
import { HttpStatusCode } from '../../application/constants/httpStatus';

const userRepo = new UserRepository();

export const checkUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  try {
    //@ts-ignore
    const userId = req.user?.id || req.body.userId || req.params.id;
    if (!userId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: 'User ID missing' });
    }

    const user = await userRepo.getUserById(userId);
    if (!user) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: 'User not found' });
    }

    if (user.blocked === true) {
        res.clearCookie('accessToken', { httpOnly: true, sameSite: 'strict', secure: true });
        res.clearCookie('refreshToken', { httpOnly: true, sameSite: 'strict', secure: true });
        return res.status(HttpStatusCode.FORBIDDEN).json({ message: 'Your account is blocked', blocked: true });
    }

    next();
  } catch (err) {
    console.error('User status check failed:', err);
    res.status(HttpStatusCode.INTERNAL_SERVER_ERROR).json({ message: 'Internal server error' });
  }
};
