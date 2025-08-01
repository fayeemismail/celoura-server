




export interface IResendOtpUseCase {
  execute(email: string): Promise<{
    status: number;
    data: { message?: string; error?: string };
  }>;
}
