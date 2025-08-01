import { User } from "../../../domain/entities/User";


export class UserProfileDTO {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string,
    ){}
    static formDomain(user: User){
        if(!user || !user._id || !user.name || !user.email || !user.role) {
            throw new Error('User not found')
        }
        return new UserProfileDTO(
            user._id,
            user.name,
            user.email,
            user.role
        )
    }
}