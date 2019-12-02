import { Document, Schema, model} from 'mongoose';

interface IUserProfile extends Document {
    first_name: string;
    last_name: string;
    gender: string;
    age: string;
    created_at: Date;
    updated_at: Date;
}

const userProfileSchema: Schema = new Schema({
    first_name: {
        type: String,
        required: true,
        trim: true
    },
    last_name: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        required: true,
        trim: true
    },
    age: {
        type: Number,
        required: true,
        trim: true
    },
    created_at: Date,
    updated_at: Date
}, { collection: 'user_profile'});

export const UserProfile = model<IUserProfile>('User_Profile', userProfileSchema);

export default UserProfile;
