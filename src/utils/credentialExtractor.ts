import * as _ from 'lodash';

import { DbConfig } from '../models/dbConfig';
import logger from '../loaders/logger';

export default class CredentialExtractor {


    constructor() { }

    public static extractDbConfig(): DbConfig {

        let dbConfig: DbConfig;

        try {
            // get config after parsing external file
            dbConfig = null;
        } catch (err) {
            logger.error('utils.CredentialExtractor.extractDbConfig :- ' + err.message);
        }

        return dbConfig;
    }

    public static getMongoCREDXMLConfig = () => {
        const mongoDbConfig: DbConfig = CredentialExtractor.extractDbConfig();
        const url = `mongodb://${mongoDbConfig.userName}:${mongoDbConfig.password}` +
            `@${global['gConfig'].MONGO_DB_SERVER}:${global['gConfig'].MONGO_DB_PORT}` +
            `?authMechanism=${global['gConfig'].MONGO_DB_AUTH_MECHANISM}&authSource=${global['gConfig'].MONGO_DB_NAME.toLowerCase()}`;
        return {
            url,
            poolSize: global['gConfig'].MONGO_DB_CONNECTION_POOL_SIZE,
            dataBaseName: global['gConfig'].MONGO_DB_NAME.toLowerCase()
        };
    }

    public static getCREDXMLConfig = () => {
        const mongo = CredentialExtractor.getMongoCREDXMLConfig();
        return {
            mongo
        };
    }
}
