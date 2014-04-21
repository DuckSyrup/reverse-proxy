request = require('request');

process.on('uncaughtException', function(err) {
	console.log('uncaught exception: ' + err);
});

var table = {}; //Routing taable

exports.init = function(options) {
    if (options.table) {
        table = options.table;
    }
}

//Add a route to the routing table
exports.addRoute = function(obj){
    table[obj.key] = obj.ip;
}

//Remove a route from the routing table
exports.removeRoute = function(obj) {
    delete table[obj];
}

//GET a route
exports.get = function(key, req, res, path){
    if (table[key]) {
        request.get('http://'+table[key] + path).pipe(res);
    }
}

//POST a route
exports.post = function(key, req, res, path) {
    if (table[key]) {
        var options = {
            url: 'http://'+table[key]+path,
	    headers: req.headers,
            body: req.rawBody
        }
        request.post(options).pipe(res);
    }
}