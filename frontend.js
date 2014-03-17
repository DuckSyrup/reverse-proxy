var express = require('express');
exp = express();
exp.set('views', __dirname + '/www/views');
exp.set('view engine', 'jade');
exp.use(express.static(__dirname + '/www/public'))

var db = require('./db_api');

exp.get('/', function(req, res){
	res.render('index',{title: 'Home'});
});

exp.get('/add'), function(req, res){
	
}

exp.listen(8080);