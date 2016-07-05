'use strict';

const Joi = require('joi');

const schema = {
    cloudfrontDomainName: Joi.string().required(),
    enabled: Joi.boolean().required(),
    origins: Joi.array().items(Joi.object().keys({
        host: Joi.string().required(),
        port: Joi.number().optional(),
        path: Joi.string().optional()
    })).required()
};

module.exports = schema;
