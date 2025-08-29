


export interface IForgotPasswordService {
  sendForgotPasswordOtp(email: string): Promise<string>;
}
