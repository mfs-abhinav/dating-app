import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import logger from '../../loaders/logger';
import UserService from '../../services/user/userService';

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
}

export default UserController;
