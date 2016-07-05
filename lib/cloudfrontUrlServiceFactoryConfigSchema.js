'use strict';

const Joi = require('joi');

const schema = {
    cloudfrontDomainName: Joi.string().required(),
    enabled: Joi.boolean().required(),
    origins: Joi.array().items(Joi.object().keys({
        host: Joi.string().required(),
        path: Joi.string().optional()
    })).required()
};

module.exports = schema;
