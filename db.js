
   // var express   =    require("express");
/*var mysql     =    require('mysql');
//var app       =    express();
//module.exports = {
var pool     ;
//}
module.exports = {
    handle_database: function(req, res) {
      pool= mysql.createPool({
    connectionLimit : 100, //important
    host     : 'localhost',
    user     : 'chatydba',
    password : 'chatydba',
    database : 'chaty',
    debug    :  false
});
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
       // console.log("printing connection obj in db.js" , connection);
    

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
  },
/*function handle_database(req,res) {
    
    pool.getConnection(function(err,connection){
        if (err) {
          res.json({"code" : 100, "status" : "Error in connection database"});
          return;
        }   

        console.log('connected as id ' + connection.threadId);
        
    

        connection.on('error', function(err) {      
              res.json({"code" : 100, "status" : "Error in connection database"});
              return;     
        });
  });
}*/

var mysql      = require('mysql');
var connection = mysql.createConnection({
    host     : '127.0.0.1',
    user     : 'chatydba',
    password : 'chatydba',
    database    : 'chaty'
});

connection.connect(function(err) {
    if (err) {
    console.error('error connecting: ' + err.stack);
    return;
}});

module.exports = connection;

//app.get("/",function(req,res){-
  //      handle_database(req,res);
//}
//);
//};

//app.listen(3000);
