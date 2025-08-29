import { Address } from "../../../../domain/entities/AddressEntity";

export interface IAddressRepository {
  create(address: Address): Promise<Address>;
  findById(id: string): Promise<Address | null>;
  findAll(): Promise<Address[]>;
  update(id: string, address: Partial<Address>): Promise<Address | null>;
  delete(id: string): Promise<void>;
  findByUserId(userId: string): Promise<Address[]>;
}