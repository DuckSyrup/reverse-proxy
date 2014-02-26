var http = require('http');

console.log('got this far');    

var request = http.get('http://localhost:8080/test1', function(res){
    console.log('test1 response: ');
    var body;
    res.on('data', function(chunk){
        body += chunk;
    });
    res.on('end', function(){
        console.log('body: ' + body);
    });
});