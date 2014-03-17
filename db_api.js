var MongoClient = require('mongodb').MongoClient;

var db;
var rp_slivers;
var ready = false;


MongoClient.connect('mongodb://db-admin:hellokitty@ds031087.mongolab.com:31087/rp-slivers', function(err, Db){
    console.log('connected to db');
    if (err) {
        return console.dir(err);
    }
    
    db = Db;
    
    rp_slivers = db.collection('rp-slivers');
    ready = true;
    
});

exports.addOne = function(obj) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            console.log('into addone');
            if (typeof obj.key == 'string' && typeof obj.ip == 'string') {
                var doc = {'key':obj.key,'ip':obj.ip};
                rp_slivers.insert(doc, function(err, result){
                    if (err) {
                        console.log('addone err: ' + err);
                        //timer.clearInterval();
                        return false;
                    }
                    else {
                        console.log('done with addone');
                        //timer.clearInterval();
                        return true;
                    }
                });
            }
            else {
                console.log(typeof obj.key + ' ' + typeof obj.ip)
                //timer.clearInterval();
                return false;
            }
        }
        else {
            //console.log('not ready yet');
        }
        
    },10);
    
    
}

exports.removeOne = function(obj) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            if (typeof obj == 'string') {
                var doc = {'key':obj};
                rp_slivers.remove(doc, function(err,result){
                    if (err) {
                        return false;
                    }
                    else {
                        return true;
                    }
                });
            }
            else return false;
        }
    },10);
}

exports.getAll = function(callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            rp_slivers.find().toArray(function(err, items){
                if (err) {
                    return false;
                }
                else {
                    var retItems = {};
                    for (var i in items) {
                        retItems[items[i].key] = items[i].ip;
                    }
                    callback(retItems);
                    return true;
                }
            });
        }
    },10);
}

exports.getOne = function(obj, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            if (typeof obj == 'string') {
                var doc = {'key':obj};
                rp_slivers.findOne(doc, function(err, item){
                    if (err) {
                        return false;
                    }
                    else {
                        callback(item.ip);
                    }
                });
            }
        }
    },10);
}



