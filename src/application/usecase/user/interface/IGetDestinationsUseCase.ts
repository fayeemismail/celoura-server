import { Destination } from "../../../../domain/entities/Destination";
import { Guide } from "../../../../domain/entities/Guide";



export interface IGetDestinationsUseCase {
    findById(id: string): Promise<Destination | null>;
    findAll(): Promise<Destination[] | null>;
    getGuideWDestination(destinationId: string) : Promise<{ destination: Destination, guide: Guide[] }>
}


























export type GuideWithDestinationInfo = {
    name: string;
    email: string;
    profilePic?: string;
    bio?: string;
    basedOn?: string;
    followers?: string[]
}





