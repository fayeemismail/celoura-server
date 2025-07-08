


export interface Posts {
    _id?: string;
    guideId: string;
    caption: string;
    photos: string[];
    comments: boolean;
    createdAt: Date;
    updatedAt: Date;
}