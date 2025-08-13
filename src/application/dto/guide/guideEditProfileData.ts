



export interface GuideEditProfileDTO {
    _id?: string;
    name?: string;
    bio?: string;
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    profilePic?: Express.Multer.File;
    removeProfilePic?: boolean;
    availableDestinations?: string[] 
}