var express = require('express');
exp = express();
//We use www as the containing folder for all front-facing webserver files
exp.set('views', __dirname + '/www/views');
exp.set('view engine', 'jade');
exp.use(express.static(__dirname + '/www/public'))
exp.use(express.bodyParser());

var url = require('url');

var db = require('./db_api');

//Basic statistics and landing page
exp.get('/', function(req, res){
	res.render('index',{title: 'Home'});
});

//List all local IP/slice name pairs
exp.get('/list', function(req,res){
	db.getAll(function(items) {
		res.send(JSON.stringify(items));
	});
});

//Add a local IP/slice name pair to the routing table from the GET paramaters
exp.get('/add', function(req, res){
	if (req.query.ip && req.query.key) {
		var newObj = {key: req.query.key, ip: req.query.ip};
		db.addOne(newObj);
	} else {
		res.send("Key and/or IP not received.");
	}
});

exp.listen(8080);