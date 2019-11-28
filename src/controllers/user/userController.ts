import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import * as _ from 'lodash';

import logger from '../../loaders/logger';
import UserService from '../../services/user/userService';
import User from '../../models/user';

class UserController {
    userService: UserService;

    constructor(userService?: UserService) {
        this.userService = userService || new UserService();
    }

    public async getLoggedInUserInfo(req: Request, res: Response) {
        try {

        } catch (err) {
            logger.error(`controller.UserController:getLoggedInUserInfo - ${JSON.stringify(err.message)}`);
            res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }

    public async signUp(req: Request, res: Response) {
        try {
            const newUser = new User(req.body);
            const user = await newUser.save();

            res.json(user);

        } catch (err) {
            logger.error(`controller.UserController:signUp - ${JSON.stringify(err.message)}`);
            res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({});
        }
    }
}

export default UserController;
