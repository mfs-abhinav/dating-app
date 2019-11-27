import httpStatus from 'http-status-codes';
import { Document, Schema, Model, model} from 'mongoose';
import validator from 'validator';
import * as _ from 'lodash';
import AppError from '../utils/appError';

interface IUser extends Document {
    email: string;
    password: string;
    toJSON(): string;
}

export interface IUserModel extends Model<IUser> {
    findByCredentials(email: string, password: string): any;
}

const userSchema: Schema = new Schema({
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

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

userSchema.statics.findByCredentials = async function(email: string, password: string) {
    const user = await this.findOne({email});
    if (!user || password !== user.password) {
        return Promise.reject(new AppError('Invalid email or password', httpStatus.UNAUTHORIZED));
    }
    return user;
};

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;

