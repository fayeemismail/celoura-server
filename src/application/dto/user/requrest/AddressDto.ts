import { Address } from "../../../../domain/entities/AddressEntity";

export class AddressDto {
  name: string;
  phone: string;
  userId: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  country: string;
  postalCode: string;

  constructor(data: Address) {
    this.name = data.name!;
    this.phone = data.phone!;
    this.userId = data.userId
    this.line1 = data.line1;
    this.line2 = data.line2;
    this.city = data.city;
    this.state = data.state;
    this.country = data.country;
    this.postalCode = data.postalCode!;
  }
}
