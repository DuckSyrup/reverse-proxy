request = require('request');

process.on('uncaughtException', function(err) {
	console.log('uncaught exception: ' + err);
});

var table = {};

exports.init = function(options) {
    if (options.table) {
        table = options.table;
    }
}

exports.addRoute = function(obj){
    table[obj.key] = obj.ip;
}

exports.removeRoute = function(obj) {
    delete table[obj];
}


exports.get = function(key, req, res, path){
    if (table[key]) {
        request.get('http://'+table[key] + path).pipe(res);
    }
}

exports.post = function(key, req, res, path) {
    if (table[key]) {
        var options = {
            url: 'http://'+table[key]+path,
            body: req.body,
            method: 'POST'
        }
        request(options).pipe(res);
    }
}