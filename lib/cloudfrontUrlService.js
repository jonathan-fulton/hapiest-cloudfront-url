'use strict';

const Url = require('url');

class CloudfrontUrlService {

    /**
     * @name CloudfrontOrigin
     * @type Object
     * @property {String} host
     * @property {String|null} path
     * @property {Number|null} port
     */

    /**
     * @param {String} cloudfrontDomainName - note, cloudfrontDomainName can also include a path portion to support "local" CF distributions stored in a particular folder on localhost
     * @param {Boolean} enabled
     * @param {CloudfrontOrigin[]} origins
     */
    constructor(cloudfrontDomainName, enabled, origins) {
        this._cloudfrontDomainName = cloudfrontDomainName;
        this._enabled = enabled;
        this._origins = origins;
    }

    getCloudfrontDomainName() {
        return this._cloudfrontDomainName;
    }

    /**
     * Returns true if the URL is from an origin in the Cloudfront distribution
     *
     * @param {String} url
     * @returns {boolean}
     */
    isOriginUrl(url) {
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
        if (urlInfo.hostname !== origin.host) {
            return false;
        }
        if (!urlInfo.path.startsWith(origin.path)) {
            return false;
        }
        if (origin.port && (parseInt(origin.port,10) !== parseInt(urlInfo.port,10))) {
            return false;
        }
        if (urlInfo.search || urlInfo.query) {
            return false;
        }

        return true;
    }

    /**
     * Returns true if the URL is from this Cloudfront distribution
     *
     * @param {String} url
     * @returns {boolean}
     */
    isDistributionUrl(url) {
        const urlNoProtocol = url.replace(/^(http:\/\/|https:\/\/|\/\/)/,'');
        return urlNoProtocol.startsWith(this._cloudfrontDomainName);
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
