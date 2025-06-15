export interface Destination {
    _id?: string;
    name: string;
    location: string;
    country: string;
    description: string;
    photos: string[];
    features: string[];
    lovedBy: string[];
    guides: string[];
    createdAt: Date;
    updatedAt: Date;
}