import httpStatus from 'http-status-codes';
import { Document, Schema, Model, model} from 'mongoose';
import validator from 'validator';
import * as _ from 'lodash';
import jwt from 'jsonwebtoken';
import AppError from '../utils/appError';

interface IUser extends Document {
    email: string;
    password: string;
    toJSON(): string;
    generateAuthToken(): string;
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
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
});

userSchema.methods.toJSON = function() {
    const user = this;
    const userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

userSchema.methods.generateAuthToken = async function() {
    const user = this;
    const access = 'auth';
    const token = jwt.sign({ _id: user._id.toHexString(), access }, global['gConfig'].JWT_SECRET).toString();

    user.tokens.push({access, token});
    await user.save();

    return token;
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

