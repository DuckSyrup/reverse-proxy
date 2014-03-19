var express = require('express');
exp = express();

//We use www as the containing folder for all front-facing webserver files
exp.use(express.static(__dirname + '/www/public'))
exp.set('views', __dirname + '/www/views');
exp.set('view engine', 'jade');
exp.use(express.favicon(__dirname + '/www/public/images/geni.ico'));

var url = require('url');

//GENI-specific modules
var db = require('./db_api');
var rp = require('./reverse-proxy');

//Basic statistics and landing page
exp.get('/', function(req, res){
	res.render('index');
});

//List all local IP/slice name pairs
exp.get('/list', function(req,res){
	db.getAll(function(items) {
		res.render('list', {items: items});
	});
});

//Remove a local slice name and its local IP pair from the routing table using GET paramaters
exp.get('/remove', function(req,res){
	if (req.query.key) {
		rp.removeRoute(req.query.key, function(worked) {
			worked ? res.send('Removed ' + req.query.key) : res.send('Failed to remove ' + req.query.key);
		});
	} else {
		res.send("Key not received");
	}
});

//Add a local IP/slice name pair to the routing table from the GET paramaters
exp.get('/add', function(req, res){
	if (req.query.ip && req.query.key) {
		var newObj = {key: req.query.key, ip: req.query.ip};
		rp.addRoute(newObj, function(worked) {
			worked ? res.send('Added ' + newObj) : res.send('Failed to add ' + newObj);
		});
	} else {
		res.send("Key and/or IP not received.");
	}
});

exp.listen(8080);