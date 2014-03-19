var rp = require('./rev-proxy');

rp.init({'table':{'test':'localhost:8080'}});
rp.addRoute({'key':'test2', 'ip':'localhost:8081'});