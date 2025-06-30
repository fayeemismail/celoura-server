import { Destination } from "../../../../domain/entities/Destination";
import { EditDestinationInput } from "../../../dto/admin/EditDestinationInput";

export interface editSuccessOuput {
    message: string;
    data: Destination
}

export interface IEditDestinationUseCase {
    execute(destinationId: string, editedData: EditDestinationInput): Promise<editSuccessOuput>
}