import { Address } from "../../../domain/entities/AddressEntity";
import { IAddressRepository } from "../../../infrastructure/database/repositories/interface/IAddressRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { AddressDto } from "../../dto/user/AddressDto";
import { validateAddress } from "../../validators/addressValidator";
import { IAddAddressUseCase } from "./interface/IAddAddressUseCase";




export class AddAddressUseCase implements IAddAddressUseCase {
    constructor(
        private readonly _addressRepo: IAddressRepository,
        private readonly _userRepo : IUserRepository
    ) { }
    async execute(addressData: AddressDto): Promise<void> {
        const { name, phone, line1, line2, userId, city, country, state, postalCode } = addressData;
        if (!name || !phone || !line1 || !city || !country || !state || !postalCode) throw new Error("All field is required");

        if(!userId) throw new Error("User Id missing");

        const errors = validateAddress(addressData);
        if(Object.keys(errors).length > 0){
            throw new Error(JSON.stringify(errors));
        }

        const userData = await this._userRepo.getUserById(userId);
        if(!userData) throw new Error("User not found");

        const newAddress:Address = {
            name,
            phone,
            userId,
            line1,
            line2: line2 ?? "",
            city,
            state,
            country,
            postalCode
        };

        const response = await this._addressRepo.create(newAddress);
        console.log(response)
    }
}