

export interface IApproveAsGuide {
    execute(applicationId: string, userId: string): Promise<any>
}