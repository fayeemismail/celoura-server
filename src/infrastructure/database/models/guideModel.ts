import { Schema, model } from 'mongoose';
import { Guide } from '../../../domain/entities/Guide';

const guideSchema = new Schema<Guide>({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  destinations: [{ type: String }],
  happyCustomers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  followers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  posts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  bio: {type: String},
  profilePic: { type: String },
  basedOn: { type: String },
  expertise: [{ type: String }],
  blocked: { type: Boolean, default: false }
}, {
  timestamps: true
});

const guideModel = model<Guide>('Guide', guideSchema);
export default guideModel;
