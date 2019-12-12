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
  app.use(
    session({
      secret: '27soR5gWBLXVrVta9iylRa1wNIM',
      resave: true,
      saveUninitialized: true,
      rolling: true,
      cookie: {
        maxAge: 30000
      }
    })
  );

  const regexEscape = (s: string) => {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
  };

  // middleware for request authentication
  app.use(
    authenticateRequest.unless({
      path: [
        { url: `${global['gConfig'].API_PREFIX}v1`, methods: ['GET'] },
        { url: `${global['gConfig'].API_PREFIX}v1/login`, methods: ['POST'] },
        {
          url: `${global['gConfig'].API_PREFIX}v1/user/register`,
          methods: ['POST']
        },
        {
          url: `${global['gConfig'].API_PREFIX}v1/password/reset/token`,
          methods: ['POST']
        },
        {
          url: `${global['gConfig'].API_PREFIX}v1/password/reset`,
          methods: ['POST']
        },
        {
          url: new RegExp(
            regexEscape(global['gConfig'].API_PREFIX) + 'v1/password/reset/.*/'
          ),
          methods: ['GET']
        },
        {
          url: new RegExp(
            regexEscape(global['gConfig'].API_PREFIX) + 'v1/user/activate/.*/'
          ),
          methods: ['GET']
        }
      ]
    })
  );

  // Load API routes
  app.use(global['gConfig'].API_PREFIX + 'v1', routes);

  // make port configurable
  const PORT = process.env.NODE_PORT || global['gConfig'].PORT;

  // global exception handler
  app.use(
    (
      err: any,
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      logger.error(
        `Error occured ${err.status} - ${JSON.stringify(err.message)}`
      );
      res
        .status(err.status || httpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: err.status, message: err.message });
    }
  );

  // global route handler
  app.use(
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      res
        .status(httpStatus.NOT_FOUND)
        .send({ message: `Page ${req.url} Not found.` });
    }
  );

  // comment this block when node runs on https
  const server = app.listen(PORT, (err: any) => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    app.emit('appStarted');
    console.log(`Server listening on port: ${global['gConfig'].PORT}`);
    console.log(
      'SwaggerUI is running on http://localhost:8090/datingapp/services/api-docs/'
    );
    logger.info(`Server listening on port: ${global['gConfig'].PORT}`);
  });

  process.on('uncaughtException', err => {
    logger.error(err);
    process.exit(1);
    return;
  });

  app.on('close', err => {
    if (err) {
      logger.error(err);
      process.exit(1);
      return;
    }
    server.close();
  });

  logger.debug('Express app loaded successfully');
};
