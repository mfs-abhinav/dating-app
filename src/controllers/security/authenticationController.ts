import { Request, Response } from 'express';
import httpStatus from 'http-status-codes';
import jwt from 'jsonwebtoken';

import AuthenticationService from '../../services/security/authenticationService';
import logger from '../../loaders/logger';
import User from '../../models/user';
import AppUtil from '../../utils/appUtil';


class AuthenticationController {
    authenticationService: AuthenticationService;

    constructor(authenticationService ?: AuthenticationService) {
        this.authenticationService = authenticationService === undefined ? new AuthenticationService() : authenticationService;
    }

    // method to process login
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

    // method to process logout
    public async processLogout(req: Request, res: Response) {

        try {
            await req['user'].removeToken(req['token']);
            res.status(httpStatus.OK).send('Logged-out sucessfully');
        } catch (err) {
            logger.error(`controller.AuthenticationController:processLogout - ${JSON.stringify(err.message)}`);
            res.status(httpStatus.UNAUTHORIZED).json('Logout failed');
        }
    }

    // method to generate token for reset password
    public async passwordResetToken(req: Request, res: Response) {
        if (req.body.email !== undefined) {

            const user = await User.findOne({email: req.body.email});
            if (!user) {
               res.send('Email address not found in system.');
            }
            const payload = {
                id: user._id,        // User ID from database
                email: user.email
            };

            const secret = user.password + '-' + user.created_at.getTime();
            const token = jwt.sign(payload, secret).toString();

            // Send email containing link to reset password.
            AppUtil.sendMail(user.email
                            , 'Password reset link'
                            , `Please click <a href="${req.headers.origin}${global['gConfig'].API_PREFIX}v1/password/reset/${payload.id}/${token}">Reset password</a> link to reset password.`);

            // In our case, will just return a link to click.
            res.send('Password reset link is sent to user email id');

        } else {
            res.send('Email address is missing.');
        }
    }

    // method to verify reset password token
    public async verifyPasswordResetToken(req: Request, res: Response) {
        const { id, token } = req.params;
        if (!id || !token) {
            res.send('Something is wrong.');
        }

        try {
            const user = await User.findOne({_id: id});
            const secret = user.password + '-' + user.created_at.getTime();
            const payload = jwt.verify(token, secret);

            // TODO:Create form to reset password.
            res.send(`
                    <form action="http://localhost:8090${global['gConfig'].API_PREFIX}v1/password/reset" method="POST">
                        <input type="hidden" name="id" value="${payload['id']}" />
                        <input type="hidden" name="token" value="${req.params.token}" />
                        <input type="password" name="password" value="" placeholder="Enter your new password..." />
                        <input type="submit" value="Reset Password" />
                    </form>
            `);
        } catch (error) {
            res.send('Invalid token.');
        }
    }

    // method to reset password
    public async resetPassword(req: Request, res: Response) {

        try {
            const { id, token, password } = req.body;
            if (!id || !token || !password) {
                res.send('Something is wrong.');
            }

            const user = await User.findOne({_id: id});
            const secret = user.password + '-' + user.created_at.getTime();
            const payload = jwt.verify(token, secret);
            user.password = password;

            await user.save();
            res.send('Your password has been successfully changed.');
        } catch (error) {
            res.send('Password reset failed.');
        }
    }

    // method to activate user
    public async activateAccount(req: Request, res: Response) {
        const { id, token } = req.params;
        if (!id || !token) {
            res.send('Something is wrong.');
        }

        try {
            const user = await User.findOne({_id: id});
            const secret = user.password + '-' + user.created_at.getTime();

            // verify token
            jwt.verify(token, secret);

            user.active = true;
            await user.save();

            res.send('Congratulations!!...User is activated. Please login');
        } catch (error) {
            res.send('Invalid token.');
        }
    }
}
export default AuthenticationController;
