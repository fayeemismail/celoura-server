

export class GuideProfileDto {
    constructor(
        public readonly id: string,
        public readonly name: string,
        public readonly email: string,
        public readonly role: string
    ) {}

    static formDomain(user: any): GuideProfileDto {
        return new GuideProfileDto(
            user.id,
            user.name,
            user.email,
            user.role
        )
    }
}