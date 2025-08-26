import { Model, Schema } from "mongoose";
import { Address } from "../../../domain/entities/AddressEntity";
import { model } from "mongoose";



const addressSchema: Schema<Address> = new Schema({
    name: { type: String },
    phone: { type: String },
    line1: { type: String, required: true },
    line2: { type: String },
    city: { type: String , required: true},
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String },
}, {
    timestamps: true
});

const AddressModel: Model<Address> = model('Address', addressSchema);
export default AddressModel;