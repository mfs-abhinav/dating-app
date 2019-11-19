import * as express from 'express';
import session from 'express-session';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rfs from 'rotating-file-stream';
import morgan from 'morgan';
import httpStatus from 'http-status-codes';

import { authenticateRequest } from '../middlewares/requestAuthentication';
import routes from '../routes/v1/route';
import logger from './logger';

export default (app: express.Express) => {

    // Enable Cross Origin Resource Sharing to all origins by default
    // To-do : need to add the domain to restrict this for specific domains. This origin will change as per the client server setup
    app.use(cors({
        origin: [
            `${global['gConfig'].DASHBOARD_PATH}`
        ],
        methods: 'POST, GET, OPTIONS, DELETE, PUT',
        credentials: true
    }));

    // needed to fix NodeJS UNABLE_TO_VERIFY_LEAF_SIGNATURE error
    process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

    // Middleware that transforms the raw string of req.body into json
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(bodyParser.json());

    // Middleware to parse the cookie and populate req.cookies with an object keyed by the cookie names
    app.use(cookieParser());

    // To-Do: Change the file path in future
    const accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: global['gConfig'].ACCSS_LOG_PATH
    });

    app.use(morgan('combined', { stream: accessLogStream }));

    // To-Do: Secret values will be changed in future and need to move to config files.
    app.use(session({
        secret: '27soR5gWBLXVrVta9iylRa1wNIM',
        resave: true,
        saveUninitialized: true,
        rolling: true,
        cookie: {
            maxAge: 30000
        }
    }));

    // middleware for request authentication
    app.use(authenticateRequest.unless({
        path: [
            { url: `${global['gConfig'].API_PREFIX}v1`, methods: ['GET'] },
            { url: `${global['gConfig'].API_PREFIX}v1/login`, methods: ['POST'] }
        ]
    }));

    // Load API routes
    app.use(global['gConfig'].API_PREFIX + 'v1', routes);

    // make port configurable
    const PORT = process.env.NODE_PORT || global['gConfig'].PORT;

    // global exception handler
    app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
        logger.error(`Error occured ${err.status} - ${JSON.stringify(err.message)}`);
        res.status(err.status || httpStatus.INTERNAL_SERVER_ERROR).json({ status: err.status, message: err.message });
    });

    // global route handler
    app.use((req: express.Request, res: express.Response, next: express.NextFunction) => {
        res.status(httpStatus.NOT_FOUND).send({ message: `Page ${req.url} Not found.` });
    });

    // comment this block when node runs on https
    const server = app.listen(PORT, (err: any) => {
        if (err) {
            logger.error(err);
            process.exit(1);
            return;
        }
        app.emit('appStarted');
        console.log(`Server listening on port: ${global['gConfig'].PORT}`);
        logger.info(`Server listening on port: ${global['gConfig'].PORT}`);
    });

    process.on('uncaughtException', (err) => {
        logger.error(err);
        process.exit(1);
        return;
    });

    app.on('close', (err) => {
        if (err) {
            logger.error(err);
            process.exit(1);
            return;
        }
        server.close();
    });

    logger.debug('Express app loaded successfully');

};
