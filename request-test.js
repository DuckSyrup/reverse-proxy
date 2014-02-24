var http = require('http');

var request = http.get('localhost/test1', function(res){
    console.log('test1 response: ');
    res.on('data', function(chunk){
        console.log(JSON.stringify(chunk));
    });
});