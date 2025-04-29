import { User } from "../entities/User";
import { findByEmail, createUser, findAllUsers } from "../framework/repository/userRepo";
import { hashPassword, comparePassword } from "../framework/services/hashService";
import { generateAccessToken, generateRefreshToken } from "../framework/services/jwtService";

export const registerUser = async ( input: User ) => {
    const existing = await findByEmail( input.email);
    if (existing) throw new Error('USER IS ALREADY EXISTS');
    const allUsers = await findAllUsers();

    const hashed = await hashPassword(input.password)
    const newUser = await createUser( { 
        name: input.name, 
        email: input.email,
        password: hashed, 
        role: 'user', 
        blocked: false,
        is_verified: false,
        createdAt: new Date(),
        updatedAt: new Date() 
    } );
    const accessToken = generateAccessToken( { id: newUser._id, role: newUser.role } );
    const refreshToken = generateRefreshToken( { id: newUser._id, role: newUser.role } );

    return { user: newUser, accessToken, refreshToken };

}

export const loginUser = async ( email: string, password: string) => {
    const userData = await findByEmail(email);
    const user = {
        id: userData?._id,
        name: userData?.name,
        email: userData?.email,
        isBlocked: userData?.blocked,
        role: userData?.role,
        is_verified: userData?.is_verified
    }
    if( !userData ) throw new Error('User not found');
    if( userData.blocked ) throw new Error("Account Blocked");

    const isMatch = await comparePassword(password, userData.password);
    if( !isMatch ) throw new Error('Invalid Credentials');

    const accessToken = generateAccessToken( { id: user.id, role: user.role } );
    const refreshToken = generateAccessToken( { id: user.id, role: user.role } );

    return { user, token: accessToken, refreshToken }

}