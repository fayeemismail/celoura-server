


export interface EditDestinationInput {
    name?: string
    location?: string;
    country?: string;
    description?: string
    features?: string[];
    photos?: Express.Multer.File[];
    existingPhotos?: string[];
    photoIndexes?: string[];
    deletedPhotos?: string;
    files?: Express.Multer.File[]
}