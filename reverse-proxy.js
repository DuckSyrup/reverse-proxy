var http = require('http'),
    httpProxy = require('http-proxy');
    
var options = {
    pathnameOnly: true,
    router: {
        '/test1' : '10.129.9.23:3000',
        '/test2' : '192.168.122.113:3000',
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