import { MongoClient } from 'mongodb';
import logger from './logger';

let mongoClient: MongoClient;

export const initialize = async () => {
    await initializeMongoDb(global['gConfig']['appCred']['mongo']);
};

let mongoDbConnection: any;

export const initializeMongoDb = async (mongoConfig) => {
    try {
        mongoClient = await MongoClient.connect(mongoConfig.url, {
            poolSize: mongoConfig.MONGO_DB_CONNECTION_POOL_SIZE,
            useNewUrlParser: true, useUnifiedTopology: true
        });

        mongoDbConnection = mongoClient.db(`${mongoConfig.dataBaseName.toLowerCase()}`);

    } catch (err) {
        logger.error(err);
    }
};

export const closeMongoConnection = () => {
    mongoClient.close();
};

export const getMongoDbConnection = () => {
    return mongoDbConnection;
};
