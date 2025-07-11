import { Destination } from "../../../../domain/entities/Destination";



export interface ICreateDestintaion {
    execute(name: string, location: string, country: string, description: string, photos: Express.Multer.File[], features: string[]): Promise<Destination>
}