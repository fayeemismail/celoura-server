

export interface IRejectAsGuide {
    execute(applicationId: string, userId: string): Promise<void>;
}