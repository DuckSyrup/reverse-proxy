var express = require('express'),
app = express(),
request = require('request');

process.on('uncaughtException', function(err) {
	console.log('uncaught exception: ' + err);
});

var table = {};

exports.init = function(options) {
    if (options.table) {
        table = options.table;
    }
    var port = options.port||3000;
    app.listen(port);
}

exports.addRoute = function(obj){
    table[obj.key] = obj.ip;
    console.log('added route: ' + JSON.stringify(table));
}

exports.removeRoute = function(obj) {
    delete table[obj];
}


exports.proxy = function(key, req, res){
    if (table[key]) {
        request.get('http://'+table[key]).pipe(res);
    }
}