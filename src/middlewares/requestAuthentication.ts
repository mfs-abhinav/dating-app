import { Request, Response, NextFunction } from 'express';
import unless from 'express-unless';
import httpStatus from 'http-status-codes';

import logger from '../loaders/logger';


const preProcessRequest: any = async (req: Request, res: Response, next: NextFunction) => {

    try {
        next();
    } catch (err) {
        logger.error(`preProcessRequest - ${err.message}`);
        res.status(httpStatus.INTERNAL_SERVER_ERROR).json({ message: err.message });
    }
};

preProcessRequest.unless = unless;

export const authenticateRequest = preProcessRequest;



