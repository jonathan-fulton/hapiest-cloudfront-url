'use strict';

const Url = require('url');

class CloudfrontUrlService {

    /**
     * @name CloudfrontOrigin
     * @type Object
     * @property {String} host
     * @property {String|null} path
     */

    /**
     * @param {String} cloudfrontDomainName
     * @param {Boolean} enabled
     * @param {CloudfrontOrigin[]} origins
     */
    constructor(cloudfrontDomainName, enabled, origins) {
        this._cloudfrontDomainName = cloudfrontDomainName;
        this._enabled = enabled;
        this._origins = origins;
    }

    /**
     * @param {String} url
     * @returns {boolean}
     */
    doesUrlMapToDistribution(url) {
        for (var i=0; i < this._origins.length; i++) {
            if (this._doesUrlMatchOrigin(this._origins[i], url)) {
                return true;
            }
        }
        return false;
    }

    /**
     * @param {CloudfrontOrigin} origin
     * @param {String} url
     * @returns {boolean}
     * @private
     */
    _doesUrlMatchOrigin(origin, url) {
        const urlInfo = Url.parse(url);
        if (urlInfo.host !== origin.host) {
            return false;
        }
        if (!urlInfo.path.startsWith(origin.path)) {
            return false;
        }
        if (urlInfo.port || urlInfo.search || urlInfo.query) {
            return false;
        }

        return true;
    }

    /**
     * @param {String} url - a URL you'd like to map to a Cloudfront URL
     * @param {Boolean} [forceConversion=false] - force a conversion even if we've disabled the service
     * @returns {String} - an updated URL if the originUrl can be mapped onto the Cloudfront distribution; original URL otherwise
     */
    convertUrl(url, forceConversion) {
        const matchingOrigin = this._getMatchingOrigin(url);
        if (!matchingOrigin || (!this._enabled && !forceConversion)) {
            return url; // No matching origin so just return the original URL (or we've disabled the distribution so shouldn't use it)
        }

        return this._convertUrl(matchingOrigin, url);
    }

    /**
     * @param {String} url
     * @returns {CloudfrontOrigin|null}
     * @private
     */
    _getMatchingOrigin(url) {
        for (let i=0; i<this._origins.length; i++) {
            if (this._doesUrlMatchOrigin(this._origins[i], url)) {
                return this._origins[i];
            }
        }
        return null;
    }

    /**
     * @param {CloudfrontOrigin} origin
     * @param {String} url - note, url must match origin to use this function
     * @returns {String} - a Cloudfront URL
     * @private
     */
    _convertUrl(origin, url) {
        const urlInfo = Url.parse(url);
        const newProtocolAndDomain = `${urlInfo.protocol}//${this._cloudfrontDomainName}`;
        const cloudfrontPath = urlInfo.path.replace(origin.path, '').replace(/^\//,'');
        return `${newProtocolAndDomain}/${cloudfrontPath}`;
    }

}

module.exports = CloudfrontUrlService;
