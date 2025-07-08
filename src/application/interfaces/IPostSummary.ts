
export interface IPostSummary {
  _id: string;
  caption: string;
  photo: string[]; 
  createdAt: Date;
  likesCount: number;
  commentsCount: number;
}


export interface IUserMinimal {
  _id: string;
  username: string;
  profilePic: string;
}

export interface IComment {
  _id: string;
  text: string;
  createdAt: Date;
  user: IUserMinimal;
}

export interface ISinglePostDetails {
  _id: string;
  caption: string;
  photo: string[];
  createdAt: Date;
  likes?: IUserMinimal[] | [];    // populated likes
  comments?: IComment[] | [];     // populated comments
}

