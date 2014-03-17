var http = require('http'),
    httpProxy = require('http-proxy'),
    db_api = require('./db_api');
    
    
var ready = false;

exports = function(port) {
    db_api.getAll(function(routes){
        var options = {
            pathnameOnly: true,
            router: routes,
            target: {
                protocol: 'http:'
            }
        };
        
        var proxyServer = httpProxy.createServer(options);
        proxyServer.listen(port||8080);
        ready = true;
    });
}



//var timer = setInterval(function(){
//    if (ready) {
//        clearInterval(timer);
//        
//    }
//},10);

exports.addRoute = function(route, target) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            if (db_api.addOne({key:route, ip:target})) {
                httpProxy.ProxyTable.addRoute('/'+route, target);
            }
        }
    },10);
}

exports.removeRoute = function(route) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            if (db_api.removeOne(route)) {
                httpProxy.ProxyTable.removeRoute(route);
            }
        }
    },10);
}