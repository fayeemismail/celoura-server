import { ISinglePostDetails } from "../../../interfaces/IPostSummary";



export interface IGetGuideSinglePostUseCase {
    execute(postId: string): Promise<ISinglePostDetails | null>;
}