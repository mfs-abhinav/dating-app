import mongoose, { Schema } from 'mongoose';
import validator from 'validator';
import * as _ from 'lodash';

const UserSchema: Schema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    }
});

export default mongoose.model('User', UserSchema);

