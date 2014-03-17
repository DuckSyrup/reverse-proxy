var express = require('express');
exp = express();
exp.set('views', __dirname + '/www/views');
exp.set('view engine', 'jade');
exp.use(express.static(__dirname + '/www/public')) 


exp.get('/*', function(req, res){
	res.render('index',{title: 'Home'});
});

exp.listen(8080);