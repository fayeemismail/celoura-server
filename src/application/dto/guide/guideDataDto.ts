import { User } from "../../../domain/entities/User";


export class GuideDataDto {
    constructor(
        public readonly _id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string
    ) {}

    static formDomain(user: User): GuideDataDto {
        if(!user || !user._id || !user.name || !user.email || !user.role) {
            throw new Error('User not found')
        }
        return new GuideDataDto(
            user._id,
            user.name,
            user.email,
            user.role
        )
    }
}