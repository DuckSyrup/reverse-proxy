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

exports.addOne = function(obj, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            if (typeof obj.key == 'string' && typeof obj.ip == 'string' && typeof obj.des == 'string') {
                var doc = {'key':obj.key,'ip':obj.ip,'des':obj.des};
                rp_slivers.insert(doc, function(err, result){
                    if (err) {
                        console.log('addone err: ' + err);
                        callback(false);
                        return false;
                    }
                    else {
                        callback(true);
                        return true;
                    }
                });
            }
            else {
                //timer.clearInterval();
                callback(false);
                return false;
            }
        }
        else {
            //console.log('not ready yet');
        }
        
    },10);
    
    
}

exports.removeOne = function(obj, callback) {
    var timer = setInterval(function(){
        if (ready) {
            clearInterval(timer);
            if (typeof obj == 'string') {
                var doc = {'key':obj};
                rp_slivers.remove(doc, function(err,result){
                    if (err) {
                        callback(false);
                        return false;
                    }
                    else {
                        callback(true);
                        return true;
                    }
                });
            }
            else {
                callback(false);
                return false;
            }
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

exports.getAllData = function(callback) {
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
                        retItems[items[i].key] = {ip:items[i].ip, key:items[i].key};
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



