


export interface newCommentToSent {
    _id: string;
    text: string; 
    createdAt: Date;
    postId: string;
    userId: string;
    parentId: string | null;
    user: {
        _id: string;
        username: string;
        profilePic: string | null;
    };
};


export interface CommentPostContent{
    postId: string;
    content: string;
    userId: string;
};

export interface AddReplyCommentOnGuidePost {
    postId: string;
    content: string;
    userId: string;
    parentId: string;
}