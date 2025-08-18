export interface UserDTO {
  _id?: string;
  name: string;
  email: string;
  blocked: boolean;
  role: 'user' | 'guide' | 'admin';
  is_verified: boolean;
  createdAt: Date;
  updatedAt: Date;
  googleUser?: boolean;
}
