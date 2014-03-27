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

//GENI-specific modules
var db = require('./db_api');
var backend = require('./backend');

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

//404 handling
app.use(function(req, res, next){
	res.status(404);
	
	// respond with html page
	if (req.accepts('html')) {
		res.render('404', { url: req.url });
		return;
	}
	
	// respond with json
	if (req.accepts('json')) {
		res.send({ error: 'Not found' });
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

var ip, port;

process.argv[2] ? ip=process.argv[2] : ip='localhost';
process.argv[3] ? port=process.argv[3] : port=8080;
console.log('Listening on ' + ip + ':' + port);
app.listen(port, ip);