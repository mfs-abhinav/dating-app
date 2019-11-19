import * as _ from 'lodash';
import config from './config.json';

import CredentialExtractor from '../utils/credentialExtractor';

// module variables
const defaultConfig = config.development;
const environment = process.env.NODE_ENV || 'local';
const environmentConfig = config[environment];
const finalConfig = _.merge(defaultConfig, environmentConfig);

// as a best practice
// all global variables should be referenced via global. syntax
// and their names should always begin with g
global['gConfig'] = finalConfig;

// Reload config dynamically while runing
export const reload = async () => {
    // global['gConfig']['appCred'] = CredentialExtractor.getCREDXMLConfig();
};
