'use strict';

const Should = require('should');
const CloudfrontUrlServiceFactory = require('../../lib/cloudfrontUrlServiceFactory');

describe('CloudfrontUrlService', function() {

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

    });

});
