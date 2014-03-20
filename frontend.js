var express = require('express');
exp = express();

//We use www as the containing folder for all front-facing webserver files
exp.use(express.static(__dirname + '/www/public'))
exp.set('views', __dirname + '/www/views');
exp.set('view engine', 'jade');
exp.use(express.favicon(__dirname + '/www/public/images/geni.ico'));

//Middleware to use POSTs
exp.use(express.json());
exp.use(express.urlencoded());

var url = require('url');

//GENI-specific modules
var db = require('./db_api');
var backend = require('./backend');

//Basic statistics and landing page
exp.get('/', function(req, res) {
	res.render('index');
});

//List all local IP/slice name pairs
exp.get('/list', function(req,res) {
	db.getAll(function(items) {
		res.render('list', {items: items});
	});
});

//Remove a local slice name and its local IP pair from the routing table using GET paramaters
exp.post('/remove', function(req,res) {
	if (req.body.key) {
		backend.removeRoute(req.body.key, function(worked) {
			res.render('remove', {worked: worked, mess: 'Attempting to remove ' + req.body.key + '...', item:req.body.key});
		});
	} else {
		res.render('remove', {worked: false, mess: 'Key not received.', item: 'UNDEFINED'});
	}
});

//Add a local IP/slice name pair to the routing table from the GET paramaters
exp.post('/add', function(req, res) {
	if (req.body.ip && req.body.key) {
		var newObj = {key: req.body.key, ip: req.body.ip};
		backend.addRoute(newObj, function(worked) {
			res.render('add', {worked: worked, mess: 'Attempting to add ' + newObj.key + '...', item:newObj});
		});
	} else {
		if (req.body.ip && !req.body.key)
			res.render('add', {worked: false, mess: 'Key not received.', item:{key: 'UNDEFINED', ip: req.body.ip}});
		else if (req.body.key && !req.body.ip)
			res.render('add', {worked: false, mess: 'IP not received.', item:{key: req.body.key, ip: 'UNDEFINED'}});
		else
			res.render('add', {worked: false, mess: 'Key and IP not received.', item:{key: 'UNDEFINED', ip: 'UNDEFINED'}});
	}
});

exp.listen(8080);