import mongoose, { Schema } from "mongoose";
import { GuideApplication } from "../../../domain/entities/GuideApplication";


const guideApplicationModel: Schema <GuideApplication> = new Schema({
    fullName: { type: String, required: true },
    email: {  type: String, required: true},
    phone: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    experience: { type: String, required: true },
    idFileUrl: { type: String },
    expertise: { type: String, required: true },
    status: { type: String, enum: [ 'pending', 'approved', 'rejected' ], default: 'pending' },
    userId: { type: String, ref: 'User' },
    basedOn: { type: String }
},{
    timestamps: true
});

export default mongoose.model('guideApplication', guideApplicationModel)