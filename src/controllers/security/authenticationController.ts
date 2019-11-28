import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';

import AuthenticationService from '../../services/security/authenticationService';
import logger from '../../loaders/logger';
import User from '../../models/user';


class AuthenticationController {
    authenticationService: AuthenticationService;
    constructor(authenticationService ?: AuthenticationService) {
        this.authenticationService = authenticationService === undefined ? new AuthenticationService() : authenticationService;
    }

    public async processLogin(req: Request, res: Response) {

        try {
            const email = req.body.email;
            const password = req.body.password;

            const user = await User.findByCredentials(email, password);
            const token = await user.generateAuthToken();

            res.status(httpStatus.OK).json(token);

        } catch (err) {
            delete req.body.password; // Remove password before logging the params
            logger.error(`controller.AuthenticationController:processLogin - ${JSON.stringify(err.message)} - incoming request parameters- ${JSON.stringify(req.body)}`);
            res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(err.message || 'Error Occured');
        }
    }

    // method to process logout and close events
    public async processLogout(req: Request, res: Response) {
        let result = 'SUCCESS';

        try {
            res.status(httpStatus.OK).json(result);
        } catch (err) {
            result = 'failure';
            logger.error(`controller.AuthenticationController:processLogout - ${JSON.stringify(err.message)} - incoming request parameters- ${JSON.stringify(req.body)}`);
            res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(result);
        }
    }
}
export default AuthenticationController;
