

export interface IOtpRepository {
    setOtp( email: string, otp: string ): Promise<void>;
    getOtp( email: string ): Promise< string | null >;
    deleteOtp( email: string ): Promise <void>;

    setTempUser(email: string, userData: object): Promise<void>;
    getTempUser(email: string) : Promise<any | null>;
    deleteTempUser(email: string): Promise<void>
};