var http = require('http'),
    rp = require('./reverse-proxy'),
    db_api = require('./db_api');
    
    
var ready = false;

db_api.getAll(function(routes){
    var options = {
        port: 3000,
        table: routes
    };
    
    rp.init(options);
    ready = true;
});


//var timer = setInterval(function(){
//    if (ready) {
//        clearInterval(timer);
//        
//    }
//},10);

exports.addRoute = function(obj, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            db_api.addOne({key:obj.key, ip:obj.ip}, function(worked) {
                if (worked) {
                    rp.addRoute(obj);
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
                    rp.removeRoute(route);
                    callback(true);
                }
                else {
                    callback(false);
                }
            });
        }
    },10);
}

exports.proxy = function(key, req, res) {
    rp.proxy(key, req, res);
}