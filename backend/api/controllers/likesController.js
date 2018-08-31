'use strict';
var mysql = require('mysql');
var connection = require("../../config/db");

exports.insertLike = function(req,res){
    connection.connection.query("select id from USUARIO where email=?", req.body.email, function(error, results, fields){
        if(error) throw error;
        var data ={idUsuario: results[0].id, idPost:req.body.idPost, categoria:req.body.categoria};
        console.log("data: ", data);
        connection.connection.query(" insert into  neguen_db.LIKE  SET ?", data ,function(error, results2, fields){
            if(error) throw error;
        res.send(JSON.stringify(results2));
    
        });
    });
}
exports.DeleteLike = function(req,res){
   // console.log("delete: ", req.body);
    connection.connection.query("select id from USUARIO where email=?", req.body.email, function(error, results, fields){
        if(error) throw error;
        connection.connection.query("delete from  neguen_db.LIKE  where  LIKE.idUsuario=? and idPost=? and categoria=?",[results[0].id, req.body.idPost, req.body.categoria ],function(error, results2, fields){
            if(error) throw error;
        res.send(JSON.stringify(results2));
        });
    });
}