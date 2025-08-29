import { Address } from "../../../domain/entities/AddressEntity";
import AddressModel from "../models/AddressModal";
import { IAddressRepository } from "./interface/IAddressRepository";


export class AddressRepository implements IAddressRepository {
  async create(address: Address): Promise<Address> {
    const newAddress = new AddressModel(address);
    const saved = await newAddress.save();
    return saved.toObject() as Address;
  }

  async findById(id: string): Promise<Address | null> {
    const address = await AddressModel.findById(id).lean();
    return address as Address | null;
  }

  async findAll(): Promise<Address[]> {
    const addresses = await AddressModel.find().lean();
    return addresses as Address[];
  }

  async update(id: string, address: Partial<Address>): Promise<Address | null> {
    const updated = await AddressModel.findByIdAndUpdate(id, address, { new: true }).lean();
    return updated as Address | null;
  }

  async delete(id: string): Promise<void> {
    await AddressModel.findByIdAndDelete(id);
  };

  async findByUserId(userId: string): Promise<Address[]> {
    const addressData = await AddressModel.find({userId});
    return addressData 
  }
}
