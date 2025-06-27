
export interface UseCaseSuccessResponse<T> {
    status: number;
    data: T
}

export interface UseCaseErrorResponse {
    status: number;
    data: {
        error: string;
    }
}

export type UseCaseResponse<T> = UseCaseSuccessResponse<T> | UseCaseErrorResponse;

interface RegisterInput {
    name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
}

export interface IRegisterUserUseCase {
    execute(input: RegisterInput): Promise<UseCaseResponse<{ message: string }>>
}