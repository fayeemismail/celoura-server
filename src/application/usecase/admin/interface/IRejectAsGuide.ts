

export interface IRejectAsGuide {
    execute(applicationId: string, userId: string, reason: string): Promise<void>;
}