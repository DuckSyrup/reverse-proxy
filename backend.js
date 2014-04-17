var http = require('http'),
    rp = require('./reverse-proxy'),
    db_api = require('./db_api');
    
    
var ready = false;

db_api.getAll(function(routes){
    var options = {
        table: routes
    };
    
    rp.init(options);
    ready = true;
});

exports.addRoute = function(obj, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            db_api.addOne(obj, function(worked) {
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

exports.get = rp.get;
exports.post = rp.post;