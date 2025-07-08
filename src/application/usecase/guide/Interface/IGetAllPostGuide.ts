import { IPostSummary } from "../../../interfaces/IPostSummary";





export interface IGetAllPostGuide {
    execute(id: string): Promise<IPostSummary[] | []>
}