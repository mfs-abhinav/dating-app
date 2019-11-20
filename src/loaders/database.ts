import mongoose from 'mongoose';
import logger from './logger';

export const initialize = async () => {

    try {
        // connect to mongodb
        await mongoose.connect(global['gConfig'].MONGO_DB_SERVER_URL, {
            poolSize: global['gConfig'].MONGO_DB_CONNECTION_POOL_SIZE,
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    } catch (error) {
        logger.error(error);
    }
};

// on connection success
mongoose.connection.on('connected', () => {
    logger.info('Connected to mongo database');
});

// on connection failure
mongoose.connection.on('error', err => {
    if (err) {
        logger.error('Error in database connection: ' + err);
    }
});

