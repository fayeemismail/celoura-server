import { IPostSummary } from "../../../interfaces/IPostSummary";



export interface IGetAllPostGuideUseCase {
    execute(id: string): Promise<IPostSummary[] | []>
}