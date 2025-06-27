
export interface LoginInput{
    email: string;
    password: string;
    role: string[];
}


export interface ILoginUserUseCase {
    execute(input: LoginInput): Promise<LoginOutput> 
}


export interface LoginOutput {
    status: number;
    data?: {
        user?: {
            id: string;
            name: string;
            email: string;
            role: string;
        };
        error?: string;
    };
    token?: string;
    refreshToken?: string;
};