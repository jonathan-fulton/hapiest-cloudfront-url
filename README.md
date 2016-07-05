## Install

```npm install --save hapiest-cloudfront-url```

## Basic usage

I highly recommend you use this with [node-config](https://github.com/lorenwest/node-config) if possible though it's not a requirement.

### With node-config

Include a config section that adheres to the following (assuming JSON format):

```JSON
{
    "myCloudfrontDistribution": {
      "cloudfrontDomainName": "somedomain.cloudfront.net",
      "enabled": "true",
      "origins": [{
        "host": "mybucket.s3.amazonaws.com",
        "path": "/public"
      },{
        "host": "www.mysite.com",
        "path": "my/crazy/path"
      }]
    }
}
```

You then simply use the ```createFromNodeConfig``` function provided:

```
const NodeConfig = require('config');
const CfUrlServiceFactory = require('hapiest-cloudfront-url');
const cfUrlService = CfUrlServiceFactory.createFromNodeConfig(NodeConfig, 'myCloudfrontDistribution');
```

### Without node-config

```
const CfUrlServiceFactory = require('hapiest-cloudfront-url');
const cfUrlService = CfUrlServiceFactory.create({
    cloudfrontDomainName: 'somedomain.cloudfront.net',
    enabled: true,
    origins: [{
        host: 'mybucket.s3.amazonaws.com',
        path: '/public'
    },{
        host: 'www.mysite.com',
        path: 'my/crazy/path'
    }]
});
```

### Converting an origin URL to Cloudfront URL

When the originUrl provided the ```convertUrl``` function matches one of the URLs associated with the distribution,
the return value is a URL relative to the Cloudfront domain.

```
const originUrl = 'http://mybucket.s3.amazonaws.com/public/images/image.jpg';
const cfUrl = cfUrlService.convertUrl(originUrl);
// http://somedomain.cloudfront.net/images/image.jpg

const originUrl2 = 'https://www.mysite.com/my/crazy/path/something.txt';
const cfUrl2 = cfUrlService.convertUrl(originUrl);
// https://somedomain.cloudfront.net/something.txt
```

If the provided URL does not match an origin, the provided URL is simply returned:

```
const originalUrl = 'http://www.someothersite.com/does/not/match/an/origin.jpg';
const cfUrl = cfUrlService.convertUrl(originUrl);
// 'http://www.someothersite.com/does/not/match/an/origin.jpg'
```

When ```enabled=false```, convertUrl always returns the original URL.