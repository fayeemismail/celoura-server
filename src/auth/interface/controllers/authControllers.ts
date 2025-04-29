import { NextFunction, Request, Response } from "express";
import { loginUser, registerUser } from "../../usecase/authUseCase";
import crypto from 'crypto'

export const signup = async ( req: Request, res: Response, next: NextFunction ): Promise<any> => {
    try {
        const { name, email, password, confirmPassword, role } = req.body;
        if(password !== confirmPassword){
            return res.status(400).json({ error: 'Invalid Credentials' })
        }
        const data = await registerUser({
            name, 
            email, 
            password, 
            role,
            blocked: false,
            is_verified: false,
            createdAt: new Date(),
            updatedAt: new Date()    
        });

        // Generating OTP
        const otp = crypto.randomInt(100000, 999999).toString();

        // await setOtp(email)

        res.status(201).json( data );
    } catch (error: any) {
        console.log(error.message)
        res.status(400).json({ error: error.message })
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        const data = await loginUser( email, password );
        res.status(200).json(data);
    } catch (error: any) {
        console.error('Login Error:', error)
        res.status(400).json({ error: error.message })
    }
}