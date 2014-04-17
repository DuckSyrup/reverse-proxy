/*---------------
LOAD DEPENDENCIES
---------------*/

var express = require('express');
app = express();

//Middleware to use POSTs
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());

//We use www as the containing folder for all front-facing webserver files
app.use(express.static(__dirname + '/www/public'))
app.set('views', __dirname + '/www/views');
app.set('view engine', 'jade');
app.use(require('static-favicon')((__dirname + '/www/public/images/geni.ico')));

var url = require('url');
var fs = require('fs');
var nconf = require('nconf');

//GENI-specific modules
var db = require('./db_api');
var backend = require('./backend');

/*---------------
ROUTES
---------------*/

//Use a route with get
app.get('/:type(s|slice)/:key*', function(req, res) {
	var path;
	req.params[0] == undefined ? path = '/' : path = req.params[0];
	backend.get(req.params.key, req, res, path);
});

//Use of route with post
app.post('/:type(s|slice)/:key*', function(req, res){
    var path;
    req.params[0] == undefined ? path = '/' : path = req.params[0];
    backend.post(req.params.key, req, res, path);
});

//Basic statistics and landing page
app.get('/', function(req, res) {
	db.getAllData(function(items) {
		items = appendURLs(items);
		res.render('index', {items: items});
	});
});

//List all local IP/slice name pairs
app.get('/list', function(req,res) {
	db.getAllData(function(items) {
		items = appendURLs(items);
		res.render('list', {items: items});
	});
});

/*---------------
API ROUTES
---------------*/

//List through API
app.get('/api/list', function(req, res) {
	db.getAllData(function(items) {
		res.json({items:items, worked: true});
	});
});

//Remove through API
app.post('/api/remove', function(req, res) {
	if (req.body.key){
		if (req.body.auth_key) {
			if (req.body.auth_key == auth_key) {
				backend.removeRoute(req.body.key, function(worked) {
					if (worked)
						message = 'Successfully removed ' + req.body.key + '.';
					else
						message:'Could not remove ' + req.body.key + '.';
					res.json({message:message, key:req.body.key, worked:worked});
				});
			} else {
				res.json({message:'Could not remove ' + req.body.key + '--auth key not valid.', key:req.body.key, worked: false}); //Wrong auth key
			}
		} else {
			res.json({message:'Could not remove ' + req.body.key + '--no auth key received.', key:req.body.key, worked: false}); //No auth key provided
		}
	} else {
		res.json({message:'Could not remove ' + req.body.key + '.', key:req.body.key, worked: false}); //Key not received/not valid
	}
});

//Add through API
app.post('/api/add', function(req,res) {
	if (req.body.ip && req.body.key) {
		if (req.body.auth_key) {
			if (req.body.auth_key == auth_key) {
				var newObj = {key:req.body.key, ip:req.body.ip, des:''};
				backend.addRoute(newObj, function(worked) {
					if (worked)
						message = 'Successfully added ' + req.body.key + ' with an IP of ' + req.body.ip + '.';
					else
						message = 'Could not add ' + req.body.key + ' with an IP of ' + req.body.ip + '.'
					res.json({message: message, key:req.body.key, ip: req.body.ip, worked:worked});
				});
			} else {
				res.json({message:'Could not remove ' + req.body.key + ' with an IP of ' + req.body.ip + '--auth key not valid.', key:req.body.key, ip:req.body.ip, worked: false}); //Wrong auth key
			}
		} else {
			res.json({message:'Could not remove ' + req.body.key + ' with an IP of ' + req.body.ip + '--no auth key received.', key:req.body.key, ip:req.body.ip, worked: false}); //No auth key provided
		}
	} else {
		res.json({message: 'Could not add ' + req.body.key + ' with an IP of ' + req.body.ip + '.', key:req.body.key, ip:req.body.ip, worked: false}); //Key or IP not received/not valid
	}
});

//Invalid API request--GET
app.get('/api/*', function (req, res) {
	res.status(404);
	res.json({error: 'No valid API request given.', worked: false});
});

//Invalid API request--POST
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

/*---------------
SERVER CONFIG AND START
---------------*/

nconf.argv().file('./config.json');
nconf.defaults({
	auth_key: 0,
	ip: 'localhost',
	port: 8080
});

var auth_key = nconf.get('auth_key');
var ip = nconf.get('ip');
var port = nconf.get('port');

console.log('Listening on ' + ip + ':' + port);
app.listen(port, ip);

/*---------------
HELPER FUNCTIONS
---------------*/

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