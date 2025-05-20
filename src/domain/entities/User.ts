export interface User {
    _id?: string
    name: string;
    email: string;
    password: string;
    blocked: boolean,
    role: 'user' | 'guide' | 'admin';
    is_verified: boolean;
    createdAt: Date;
    updatedAt: Date;
    googleUser?: boolean;
}