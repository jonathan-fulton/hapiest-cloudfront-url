'use strict';

const Should = require('should');
const Path = require('path');
const NodeConfigUncached = require('config-uncached');
const CloudfrontUrlServiceFactory = require('../../lib/cloudfrontUrlServiceFactory');

describe('CloudfrontUrlServiceFactory', function() {
   
    describe('createFromNodeConfig', function() {
       
        it('Should create an instance of CloudfrontUrlService with a single origin', function() {
            const nodeConfig = getNodeConfig('config-1');
            
            const cloudfrontUrlService = CloudfrontUrlServiceFactory.createFromNodeConfig(nodeConfig, 'myCloudfrontDistribution');
            Should.exist(cloudfrontUrlService);
            cloudfrontUrlService._cloudfrontDomainName.should.eql('asdfweqvassasdf.cloudfront.net');
            cloudfrontUrlService._enabled.should.be.True();
            cloudfrontUrlService._origins.should.deepEqual([{host: 'my-bucket.s3.amazonaws.com', path: '/public'}])
        });

        it('Should create an instance of CloudfrontUrlService with three origins', function() {
            const nodeConfig = getNodeConfig('config-2');

            const cloudfrontUrlService = CloudfrontUrlServiceFactory.createFromNodeConfig(nodeConfig, 'threeOrigins');
            Should.exist(cloudfrontUrlService);
            cloudfrontUrlService._cloudfrontDomainName.should.eql('blahblah.cloudfront.net');
            cloudfrontUrlService._enabled.should.be.False();
            cloudfrontUrlService._origins.should.deepEqual([
                {host: 'my-bucket.s3.amazonaws.com', path: '/public'},
                {host: 'www.mysite.com', path: '/videos/some-category'},
                {host: 'www.anothersite.com', path: '/yet/another/path'}
            ])
        });

        it('Should create an instance of CloudfrontUrlService with a single origin with localhost and port', function() {
            const nodeConfig = getNodeConfig('config-3');

            const cloudfrontUrlService = CloudfrontUrlServiceFactory.createFromNodeConfig(nodeConfig, 'localhostOrigin');
            Should.exist(cloudfrontUrlService);
            cloudfrontUrlService._cloudfrontDomainName.should.eql('blahblah.cloudfront.net');
            cloudfrontUrlService._enabled.should.be.True();
            cloudfrontUrlService._origins.should.deepEqual([{host: 'localhost', port: 3000, path: '/localstorage/my-bucket/public'}])
        });
        
    });
    
});

function getNodeConfig(configFolder) {
    const configDir = Path.join(__dirname, '../unit-helper/cloudfrontUrlServiceFactory', configFolder);
    process.env.NODE_CONFIG_DIR = configDir;
    return NodeConfigUncached(true);
}
