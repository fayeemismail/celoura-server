

export interface EditProfileInput {
    id: string;
    name?: string;
    newPassword?: string;
    confirmPassword?: string;
    currentPassword?: string;
};