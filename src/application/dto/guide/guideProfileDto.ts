import { User } from "../../../domain/entities/User";


export class GuideProfileDto {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string
    ) {}

    static formDomain(user: User): GuideProfileDto {
        if(!user || !user._id || !user.name || !user.email || !user.role) {
            throw new Error('User not found')
        }
        return new GuideProfileDto(
            user._id,
            user.name,
            user.email,
            user.role
        )
    }
}