'use strict';

const Should = require('should');
const CloudfrontUrlServiceFactory = require('../../lib/cloudfrontUrlServiceFactory');

describe('CloudfrontUrlService', function() {
    
    describe('getCloudfrontDomainName', function() {
       
        it('Should return the Cloudfront domain name', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [{host: 'my-bucket.s3.amazonaws.com', path: 'public'}]
            });

            const cfDomainName = cfUrlService.getCloudfrontDomainName();

            cfDomainName.should.eql('dafjlsavc13asd.cloudfront.net');
        });
        
    });

    describe('convertUrl', function() {

        it('Should correctly map a URL from a single origin to a Cloudfront URL', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [{host: 'my-bucket.s3.amazonaws.com', path: 'public'}]
            });
            
            const originalUrl = 'http://my-bucket.s3.amazonaws.com/public/images/thumbnail.jpg';
            const convertedUrl = cfUrlService.convertUrl(originalUrl);

            convertedUrl.should.eql('http://dafjlsavc13asd.cloudfront.net/images/thumbnail.jpg');
        });

        it('Should correctly map a URL from a single origin to a Cloudfront URL with no pah provided on origin', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [{host: 'my-bucket.s3.amazonaws.com'}]
            });

            const originalUrl = 'http://my-bucket.s3.amazonaws.com/public/images/thumbnail.jpg';
            const convertedUrl = cfUrlService.convertUrl(originalUrl);

            convertedUrl.should.eql('http://dafjlsavc13asd.cloudfront.net/public/images/thumbnail.jpg');
        });

        it('Should correctly map a URL from a single origin to a Cloudfront URL with multi-segment path', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [{host: 'my-bucket.s3.amazonaws.com', path: '/public/images/thumbnails'}]
            });

            const originalUrl = 'http://my-bucket.s3.amazonaws.com/public/images/thumbnails/some-small-image.jpg';
            const convertedUrl = cfUrlService.convertUrl(originalUrl);

            convertedUrl.should.eql('http://dafjlsavc13asd.cloudfront.net/some-small-image.jpg');
        });

        it('Should correctly map a URL to a Cloudfront URL for a multi-origin distribution', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [
                    {host: 'my-bucket.s3.amazonaws.com', path: '/public/images/thumbnails'},
                    {host: 'www.mysite.com', path: 'some-path'}
                ]
            });

            const originalUrl = 'https://www.mysite.com/some-path/hello-world/index.js';
            const convertedUrl = cfUrlService.convertUrl(originalUrl);

            convertedUrl.should.eql('https://dafjlsavc13asd.cloudfront.net/hello-world/index.js');
        });

        it('Should correctly map a URL from a single origin with a port specified to a Cloudfront URL', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [{host: 'localhost', port: 3000, path: 'localstorage/bucket/public'}]
            });

            const originalUrl = 'http://localhost:3000/localstorage/bucket/public/images/thumbnail.jpg';
            const convertedUrl = cfUrlService.convertUrl(originalUrl);

            convertedUrl.should.eql('http://dafjlsavc13asd.cloudfront.net/images/thumbnail.jpg');
        });

    });

    describe('isDistributionUrl', function() {

        it('Should return true when the url matches distribution and false when it does not', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [{host: 'localhost', port: 3000, path: 'localstorage/bucket/public'}]
            });

            const urlToCheck_true = 'http://dafjlsavc13asd.cloudfront.net/images/folder/thumbnail.jpg';
            const isDistributionUrl_true = cfUrlService.isDistributionUrl(urlToCheck_true);
            isDistributionUrl_true.should.be.True();

            const urlToCheck_false = 'http://vizual.ai/images/folder/thumbnail.jpg';
            const isDistributionUrl_false = cfUrlService.isDistributionUrl(urlToCheck_false);
            isDistributionUrl_false.should.be.False();
        });

        it('Should return true when the url matches distribution and false when it does not even for distributions with paths in the domain name', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'localhost:3000/localstorage/public/images',
                enabled: true,
                origins: [{host: 'localhost', port: 3000, path: 'localstorage/bucket/public'}]
            });

            const urlToCheck_true = 'http://localhost:3000/localstorage/public/images/folder/thumbnail.jpg';
            const isDistributionUrl_true = cfUrlService.isDistributionUrl(urlToCheck_true);
            isDistributionUrl_true.should.be.True();

            const urlToCheck_false = 'http://localhost:3000/localstorage/thumbnail.jpg';
            const isDistributionUrl_false = cfUrlService.isDistributionUrl(urlToCheck_false);
            isDistributionUrl_false.should.be.False();
        });

    });

    describe('matchesDistributionOrigins', function() {

        it('Should return true when the url matches an origin and false when it does not', function() {
            const cfUrlService = CloudfrontUrlServiceFactory.create({
                cloudfrontDomainName: 'dafjlsavc13asd.cloudfront.net',
                enabled: true,
                origins: [
                    {host: 'localhost', port: 3000, path: '/localstorage/bucket/public'},
                    {host: 'static.digg.com', path: '/'},
                ]
            });

            const localhost_url_true = 'http://localhost:3000/localstorage/bucket/public/images/somethumbnail.jpg';
            const isOriginUrl_localhost_true = cfUrlService.isOriginUrl(localhost_url_true);
            isOriginUrl_localhost_true.should.be.True();

            const digg_url_true = 'http://static.digg.com/somethumbnail.jpg';
            const isOriginUrl_digg_true = cfUrlService.isOriginUrl(digg_url_true);
            isOriginUrl_digg_true.should.be.True();

            const vizualai_url_false = 'http://vizual.ai/images/nomatch/thumbnail.jpg';
            const isOriginUrl_vizualai_true = cfUrlService.isOriginUrl(vizualai_url_false);
            isOriginUrl_vizualai_true.should.be.False();

        });

    });

});
