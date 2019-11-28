import { Request, Response, NextFunction } from 'express';
import unless from 'express-unless';
import httpStatus from 'http-status-codes';

import logger from '../loaders/logger';

import User from '../models/user';

const preProcessRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-auth'];
        const user = await User.findByToken(token);

        req['user'] = user;
        req['token'] = token;
        next();
    } catch (err) {
        logger.error(`preProcessRequest - ${err.message}`);
        res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json(err.message || 'Error Occured');
    }
};

preProcessRequest.unless = unless;

export const authenticateRequest = preProcessRequest;



