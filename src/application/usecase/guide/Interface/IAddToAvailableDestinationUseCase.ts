


export interface IAddToAvailableDestinationUseCase {
    execute(destinationId: string, guideId: string): Promise<void>;
}