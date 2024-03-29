import httpStatus from 'http-status-codes';
import { Document, Schema, Model, model} from 'mongoose';
import validator from 'validator';
import * as _ from 'lodash';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import AppError from '../utils/appError';

interface IUser extends Document {
    email: string;
    password: string;
    active: boolean;
    created_at: Date;
    updated_at: Date;
    user_profile: Schema.Types.ObjectId;
    toJSON(): string;
    generateAuthToken(): string;
}

export interface IUserModel extends Model<IUser> {
    findByCredentials(email: string, password: string): any;
    findByToken(token: string): any;
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
    active: {
        type: Boolean,
        required: true
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
    }],
    user_profile: {
        type: Schema.Types.ObjectId,
        ref: 'User_Profile'
    },
    created_at: Date,
    updated_at: Date
}, { collection: 'user'});

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

userSchema.methods.removeToken = function(token: string) {
    const user = this;

    return user.update({
        $pull: {
            tokens: {
                token
            }
        }
    });
};

userSchema.statics.findByToken = async function(token: string) {
    let decoded: any;

    try {
        decoded = jwt.verify(token, global['gConfig'].JWT_SECRET);
    } catch (e) {
        return Promise.reject(new AppError('Invalid token', httpStatus.UNAUTHORIZED));
    }

    return await this.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': decoded.access
    });
};

userSchema.statics.findByCredentials = async function(email: string, password: string) {
    const user = await this.findOne({email});
    if (!user) {
        return Promise.reject(new AppError('User not found in system', httpStatus.UNAUTHORIZED));
    }

    if (!user.active) {
        return Promise.reject(new AppError('User is not active.', httpStatus.UNAUTHORIZED));
    }
    const passwordMatched = await bcrypt.compare(password, user.password);

    if (!passwordMatched) {
        return Promise.reject(new AppError('Password does not match', httpStatus.UNAUTHORIZED));
    }

    return user;
};

userSchema.pre('save', async function(this: IUser, next) {
    const user = this;
    if (user.isModified('password')) {
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(user.password, salt);
        user.password = hashedPassword;
    }
    if (!user.created_at) {
        user.created_at = new Date();
    }
    user.updated_at = new Date();

    next();
});

export const User: IUserModel = model<IUser, IUserModel>('User', userSchema);

export default User;

