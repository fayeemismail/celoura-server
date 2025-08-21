import { model, Model, Schema } from "mongoose";
import { Booking } from "../../../domain/entities/BookingEntity";




const bookingSchema: Schema <Booking> = new Schema({
    guide:{
        id: { type: String, required: true, ref: "User" },
        name: { type: String, required: true },
        email: { type: String, required: true },
    },
    user: {
        id: { type: String, required: true, ref: "User" },
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true },
        address: { type: String, required: true }
    },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    durationInDays: { type: String, required: true },
    budget: { type: String },
    locations: [{ type: String, required: true }],
    
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'cancelled', 'completed'],
        default: 'pending',
        required: true
    },
    specialRequests: { type: String },
    
    guideAccepted: { type: Boolean, default: false },
    rejected: { type: Boolean, default: false },
    rejectedReason: { type: String, default: "" },
    cancelledBy: {
        type: String,
        enum: ['user', 'guide'], 
        default: null
    },

    paymentStatus: { type: String, default: "pending" },
    paymentDeadline: { type: Date }

}, {
    timestamps: true
});


const bookingModel: Model<Booking> = model('Booking', bookingSchema);
export default bookingModel;