'use strict';

const Joi = require('joi');
const configSchema = require('./cloudfrontUrlServiceFactoryConfigSchema');
const CloudfrontUrlService = require('./cloudfrontUrlService');

class CloudfrontUrlServiceFactory {

    /**
     * @name CloudfrontUrlServiceFactoryConfig
     * @type Object
     * @property {String} cloudfrontDomainName
     * @property {Boolean} enabled
     * @property {CloudfrontUrlServiceFactoryConfigOrigin[]} origins
     */

    /**
     * @name CloudfrontUrlServiceFactoryConfigOrigin
     * @type Object
     * @property {String} host
     * @property {String} [path="/"]
     * @property {Number} [port]
     */


    /**
     * @param {Config} nodeConfig
     * @param {String} nodeConfigPath
     */
    static createFromNodeConfig(nodeConfig, nodeConfigPath) {
        return CloudfrontUrlServiceFactory.create(nodeConfig.get(nodeConfigPath));
    }

    /**
     * @param {CloudfrontUrlServiceFactoryConfig} config
     * @returns {CloudfrontUrlService}
     */
    static create(config) {
        const validationResult = Joi.validate(config, configSchema);
        if (validationResult.error) {
            throw validationResult.error;
        }

        const origins = CloudfrontUrlServiceFactory._createOrigins(config.origins);
        return new CloudfrontUrlService(config.cloudfrontDomainName, config.enabled, origins);
    }

    /**
     * @param {CloudfrontUrlServiceFactoryConfigOrigin[]} originsConfig
     * @returns {CloudfrontOrigin[]}
     * @private
     */
    static _createOrigins(originsConfig) {
        return originsConfig.reduce((origins, originConfig) => {
            origins.push(CloudfrontUrlServiceFactory._createOrigin(originConfig));
            return origins;
        }, []);
    }

    /**
     * @param {CloudfrontUrlServiceFactoryConfigOrigin} originConfig
     * @returns {CloudfrontOrigin}
     * @private
     */
    static _createOrigin(originConfig) {
        // Replace leading and trailing /'s
        const normalizedPath = (originConfig.path || '/').replace(/^\//,'').replace(/\/$/, '');
        const origin = {
            host: originConfig.host,
            path: `/${normalizedPath}`
        };
        if (originConfig.port) {
            origin.port = originConfig.port;
        }
        return origin;
    }

}

module.exports = CloudfrontUrlServiceFactory;
