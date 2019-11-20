import * as configLoader from '../config/configure';

import expressLoader from './express';
import swaggerLoader from './swagger';
import * as database from './database';

export default async (app: any) => {

  // load the config
  await configLoader.reload();

  // load db configuration
  await database.initialize();

  // load swagger doc
  swaggerLoader(app);

  // load express app
  expressLoader(app);
};

