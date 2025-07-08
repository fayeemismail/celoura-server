


export interface Comments{
    _id?: string;
    userId: string;
    postId: string;
    content: string;
    parentId?: string | null;
    createdAt: Date;
}