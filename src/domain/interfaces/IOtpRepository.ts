

export interface IOtpRepository {
    setOtp( key: string, otp: string ): Promise<void>;
    getOtp( key: string ): Promise< string | null >;
    deleteOtp( key: string ): Promise <void>;

    setTempUser(email: string, userData: object): Promise<void>;
    getTempUser(email: string) : Promise<any | null>;
    deleteTempUser(email: string): Promise<void>;

    // getforgotOtp(email: string): Promise<string | null>
};