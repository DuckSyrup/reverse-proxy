var express = require('express'),
app = express(),
request = require('request');

app.get('/', function(req, res){
    res.send('sup!');
});

app.listen(8081);