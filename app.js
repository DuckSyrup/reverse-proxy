var express = require('express');
var app = express();
var util = require('util');
var circularJSON = require('circular-json');

app.get('/*', function(req, res){
	var newObj = {};
	newObj.req = req;
	newObj.ip = req.ip;
	res.send(circularJSON.stringify(newObj));
});




app.listen(3000);
console.log('Listening on 3000');