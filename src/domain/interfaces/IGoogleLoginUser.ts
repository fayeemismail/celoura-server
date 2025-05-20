import { User } from "../entities/User";


export interface IGoogleLoginUser{
    execute(profile :any) : Promise<User>
}