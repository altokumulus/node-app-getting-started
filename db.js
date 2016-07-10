
   // var express   =    require("express");
var mysql     =    require('mysql');
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

//app.get("/",function(req,res){-
  //      handle_database(req,res);
}
//);
//};

//app.listen(3000);
