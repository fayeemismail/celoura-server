import { Model, model, Schema } from "mongoose";
import { User } from "../../../domain/entities/User";

const userSchema: Schema < User > = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    blocked: { type: Boolean, default: false },
    role: { type: String, enum: [ 'user', 'guide', 'admin' ],  default: 'user' },
    is_verified: { type: Boolean, default: false },
    googleUser: { type: Boolean, default: false},

    //for guides
    
}, {
    timestamps: true
});

const userModel: Model < User > = model( 'User', userSchema );
export default userModel;