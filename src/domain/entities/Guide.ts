import { Types } from 'mongoose'



export interface Guide {
  _id?: string;
  user: Types.ObjectId; 
  destinations: string[];
  happyCustomers: string[];
  basedOn: string;
  followers: string[];
  bio: string;
  profilePic: string;
  posts: string[];
  createdAt?: Date; 
  updatedAt?: Date;
}
