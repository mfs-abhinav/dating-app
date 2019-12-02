import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import * as _ from 'lodash';
import jwt from 'jsonwebtoken';

import logger from '../../loaders/logger';
import UserService from '../../services/user/userService';
import User from '../../models/user';
import AppUtil from '../../utils/appUtil';
import { UserProfile } from './../../models/userProfile';

class UserController {
    userService: UserService;

    constructor(userService?: UserService) {
        this.userService = userService || new UserService();
    }

    public async register(req: Request, res: Response) {
        try {
            const {email, password, firstName, lastName, gender, age} = req.body;

            const userProfile = new UserProfile({ first_name: firstName, last_name: lastName, gender, age });
            const newUser = new User({ email, password, active: false, user_profile: userProfile._id });
            const user = await newUser.save();
            await userProfile.save();

            const payload = {
                id: user._id,        // User ID from database
                email: user.email
            };

            const secret = user.password + '-' + user.created_at.getTime();
            const token = jwt.sign(payload, secret).toString();

            // Send email to activate account.
            AppUtil.sendMail(user.email
                            , 'Account activation'
                            , `Please click <a href="${req.headers.origin}${global['gConfig'].API_PREFIX}v1/user/activate/${payload.id}/${token}">Activate Account</a> link to activate account.`);


            res.json(user);

        } catch (err) {
            logger.error(`controller.UserController:register - ${JSON.stringify(err.message)}`);
            res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }
}

export default UserController;
