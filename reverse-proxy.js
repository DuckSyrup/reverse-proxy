var http = require('http'),
    httpProxy = require('http-proxy');
    
var options = {
    pathnameOnly: true,
    router: {
        '/something1' : 'node12.princeton.vicci.org',
        '/something2' : 'node12.washington.vicci.org',
        '/something3' : 'node23.washington.vicci.org',
        '/something4' : 'node30.princeton.vicci.org',
        '/something5' : 'node32.princeton.vicci.org',
        '/something6' : 'node32.washington.vicci.org',
        '/something7' : 'node55.princeton.vicci.org',
        '/something8' : 'node55.washington.vicci.org',
        '/something9' : 'node63.princeton.vicci.org'
    }
};

var proxyServer = httpProxy.createServer(options);
proxyServer.listen(80);