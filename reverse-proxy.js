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

exports.addRoute = function(route, target, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            db_api.addOne({key:route, ip:target}, function(worked) {
                if (worked) {
                    httpProxy.ProxyTable.addRoute('/'+route, target);
                    callback(true);
                }
                else {
                    callback(false);
                }
            });
        }
    },10);
}

exports.removeRoute = function(route, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            db_api.removeOne(route, function(worked) {
                if (worked) {
                    httpProxy.ProxyTable.removeRoute(route);
                    callback(true);
                }
                else {
                    callback(false);
                }
            });
        }
    },10);
}