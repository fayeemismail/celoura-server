



export interface GuideWithUserData {
  _id: string;
  name?: string;
  email?: string;
  role: "user" | "admin" | "guide";  // <-- not string[]
  is_verified?: boolean;
  googleUser?: boolean;
  userCreatedAt?: Date;
  userUpdatedAt?: Date;

  destinations?: string[];
  happyCustomers?: string[];
  followers?: string[];
  posts?: string[];
  bio?: string;
  profilePic?: string;
}
