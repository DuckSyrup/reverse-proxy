var http = require('http'),
    rp = require('./reverse-proxy');

function backend_proto(db_api) {
    
    var ready = false;

    db_api.getAll(function(routes){
        var options = {
            table: routes
        };
        
        rp.init(options);
        ready = true;
    });


    this.addRoute = function(obj, callback) {
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
    
    this.removeRoute = function(route, callback) {
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
    
    this.get = rp.get;
    this.post = rp.post;
}
    
exports.backend = function(db_api) {
    return new backend_proto(db_api);
}