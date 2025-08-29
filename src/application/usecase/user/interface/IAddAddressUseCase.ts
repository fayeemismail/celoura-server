import { Address } from "../../../../domain/entities/AddressEntity";
import { AddressDto } from "../../../dto/user/AddressDto";



export interface IAddAddressUseCase {
    execute(addressData: AddressDto) : Promise<void>;
}