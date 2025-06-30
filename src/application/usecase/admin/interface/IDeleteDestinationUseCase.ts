



export interface IDeleteDestinationUseCase {
    execute(destinationId: string) : Promise<{ message: string }>;
}