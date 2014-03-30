var express = require('express');
app = express();

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'))
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');
app.use(express.favicon(__dirname + '/www/public/images/geni.ico'));

//Middleware to use POSTs
app.use(express.json());
app.use(express.urlencoded());

var url = require('url');
var argv = require('optimist').argv;
var fs = require("fs");

//GENI-specific modules
var db = require('./db_api');
var backend = require('./backend');

//Config file
var config_path = './config.json';
fs.exists(config_path, function (config_exists) {
	var config;
	if (config_exists) {
		config = require(config_path);
	}
	else {
		console.log('No config file provided.');
		config = false;
	}
	startServer(config);
});

//Basic statistics and landing page
app.get('/', function(req, res) {
	db.getAllData(function(items) {
		items = appendURLs(items);
		res.render('index', {items: items});
	});
});

//Use a route
app.get('/:type(s|slice)/:key*', function(req, res) {
	var path;
	req.params[0] == undefined ? path = '/' : path = req.params[0];
	backend.proxy(req.params.key, req, res, path);
});

//Use a route--POST
app.post('/:type(s|slice)/:key*', function(req,res) {
	var path;
	req.params[0] == undefined ? path = '/' : path = req.params[0];
	backend.proxy(req.params.key, req, res, path);
});

//List all local IP/slice name pairs
app.get('/list', function(req,res) {
	db.getAllData(function(items) {
		items = appendURLs(items);
		res.render('list', {items: items});
	});
});

//Remove a local slice name and its local IP pair from the routing table using GET paramaters
app.post('/remove', function(req,res) {
	if (req.body.key) {
		backend.removeRoute(req.body.key, function(worked) {
			res.render('remove', {worked: worked, mess: 'Attempting to remove ' + req.body.key + '...', item:req.body.key});
		});
	} else {
		res.render('remove', {worked: false, mess: 'Key not received.', item: 'UNDEFINED'});
	}
});

//Add a local IP/slice name pair to the routing table from the GET paramaters
app.post('/add', function(req, res) {
	if (req.body.ip && req.body.key) {
		var newObj = {key: req.body.key, ip: req.body.ip, des:''};
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

//List through API
app.get('/api/list', function(req, res) {
	db.getAllData(function(items) {
		res.json({items:items, worked: true});
	});
});

//List through API
app.post('/api/list', function(req, res) {
	db.getAllData(function(items) {
		res.json({items:items, worked: true});
	});
});

//Remove through API
app.post('/api/remove', function(req, res) {
	if (req.body.key){
		backend.removeRoute(req.body.key, function(worked) {
			if (worked)
				message = 'Successfully removed ' + req.body.key + '.';
			else
				message:'Could not remove ' + req.body.key + '.';
			res.json({message:message, key:req.body.key, worked:worked});
		});
	} else {
		res.json({message:'Could not remove ' + req.body.key + '.', key:req.body.key, worked: false});
	}
});

//Add through API
app.post('/api/add', function(req,res) {
	if (req.body.ip && req.body.key) {
		var newObj = {key:req.body.key, ip:req.body.ip, des:''};
		backend.addRoute(newObj, function(worked) {
			if (worked)
				message = 'Successfully added ' + req.body.key + ' with an IP of ' + req.body.ip + '.';
			else
				message = 'Could not add ' + req.body.key + ' with an IP of ' + req.body.ip + '.'
			res.json({message: message, key:req.body.key, ip: req.body.ip, worked:worked});
		});
	} else {
		res.json({message: 'Could not add ' + req.body.key + ' with an IP of ' + req.body.ip + '.', key:req.body.key, ip:req.body.ip, worked: false});
	}
});

//Invalid API request
app.get('/api/*', function (req, res) {
	res.status(404);
	res.json({error: 'No valid API request given.', worked: false});
});

app.post('/api/*', function (req, res) {
	res.status(404);
	res.json({error: 'No valid API request given.', worked: false});
});

//404 handling
app.use(function(req, res, next){
	res.status(404);
	
	// respond with html page
	if (req.accepts('html')) {
		res.render('404');
		return;
	}
	
	// respond with json
	if (req.accepts('json')) {
		res.json({ error: '404 - Not found' });
		return;
	}
	
	// default to plain-text. send()
	res.type('txt').send('Not found');
});

//Function to append a URL to the route object
function appendURLs(items) {
	for (i in items) {
		items[i].url = generateURL(items[i].key);
	}
	return items;
}

//Generate a URL for a route
function generateURL(key) {
	return ('/s/' + key);
}

//Start the server.  Called AFTER the file system attempts to find config.json.  Config file overrides defaults, and command line arguments override config file.
function startServer(config) {
	//Default variables
	var ip = "localhost";
	var port = 8080;
	var auth_key = 0;
	
	//Read from config file, if one is provided.
	if (config) {
		if (config.ip) ip = config.ip;
		if (config.port) port = config.port;
		if (config.auth_key) auth_key = config.auth_key;
	}
	
	//Take command line arguments
	if (argv.ip) ip = argv.ip;
	if (argv.port) port = argv.port;
	if (argv.auth_key) auth_key = argv.auth_key;
	
	console.log('Listening on ' + ip + ':' + port);
	app.listen(port, ip);
}

