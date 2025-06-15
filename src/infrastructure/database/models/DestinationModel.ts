import { model, Model, Schema } from "mongoose";
import { Destination } from "../../../domain/entities/Destination";



const destinationSchema: Schema<Destination> = new Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    description: { type: String, required: true },
    photos: [{ type: String, required: true }],
    features: [ { type: String, required: true } ],
    lovedBy: [ { type: Schema.Types.ObjectId, ref: 'User', default: [] } ],
    guides: [ { type: Schema.Types.ObjectId, ref: 'User', default: [] } ]
}, {
    timestamps: true
});

const destinationModel: Model<Destination> = model<Destination>("Destination", destinationSchema);
export default destinationModel;