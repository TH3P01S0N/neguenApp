'use strict';
var mysql = require('mysql');
var connection = require("../../config/db");
//idUsuario:  id del usuario que va seguir al usuario IdUsuarioSeg
//
exports.Follow = function(req,res){
    connection.connection.query("select id from USUARIO where email=?", req.body.email, function(error, results, fields){
        if(error) throw error;
        var data ={idUsuario: results[0].id, idUsuarioSeg:req.body.idUsuarioSeg, borrado:'no'};
        console.log("data: ", data);
        connection.connection.query(" insert into  SEGUIR  SET ?", data ,function(error, results2, fields){
            if(error) throw error;
        res.send(JSON.stringify(results2));
    
        });
    });
}
exports.Unfollow = function(req,res){
   // console.log("delete: ", req.body);
    connection.connection.query("select id from USUARIO where email=?", req.body.email, function(error, results, fields){
        if(error) throw error;
        connection.connection.query("delete from  SEGUIR  where  idUsuario=? and idUsuarioSeg=?",[results[0].id, req.body.idUsuarioSeg],function(error, results2, fields){
            if(error) throw error;
        res.send(JSON.stringify(results2));
        });
    });
}