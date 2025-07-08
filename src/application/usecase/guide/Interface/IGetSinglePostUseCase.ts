import { Posts } from "../../../../domain/entities/PostEntity";
import { ISinglePostDetails } from "../../../interfaces/IPostSummary";



export interface IGetSinglePostUseCase {
    execute(_id: string): Promise<ISinglePostDetails | null>;
}