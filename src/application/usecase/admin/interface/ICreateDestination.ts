import { Destination } from "../../../../domain/entities/Destination";



export interface ICreateDestintaion {
    execute(name: string,
    location: string,
    country: string,
    description: string,
    photos: string[],
    features: string[]): Promise<Destination>
}