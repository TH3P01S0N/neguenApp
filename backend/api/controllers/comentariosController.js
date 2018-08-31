'use strict';
var mysql = require('mysql');
var fs = require('fs');
var connection = require("../../config/db");

exports.listComentarios = function(req, res){
    connection.connection.query("select COMENTARIO.id, USUARIO.id as idUsuario, nombre, email, idPost, COMENTARIO.descripcion, COMENTARIO.fecha_creac from COMENTARIO, USUARIO WHERE COMENTARIO.idUsuario=USUARIO.id and idPost=? and COMENTARIO.categoria=? ORDER BY COMENTARIO.id DESC", [req.body.id, req.body.categoria], function(err, row,fields){
        if(err) console.log(err);
      //  console.log("getuser: ", row);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 0});
       }
       else{
               res.send({
                       success:true,
                       'message': row
               });
           }
       });

}
exports.insertComentario = function(req,res){
    connection.connection.query("SELECT id, nombre FROM USUARIO WHERE email = ? ", req.body.email,function(error, results, fields ){
        if(error) throw error;
        if(results.length < 0){
            return res.send({'success': false, 'message': 'Hubo un problema'});
        }
        else{
            var data ={idUsuario: results[0].id,  idPost:req.body.idPost, descripcion: req.body.descripcion, categoria:req.body.categoria, borrado:'no'};
            console.log("data: ", data);
            connection.connection.query("insert into  COMENTARIO  SET ?", data ,function(error, results2, fields){
                if(error) throw error;
            res.send({id: results[0].id, nombreUser:results[0].nombre, result: results2 });   
            });
        }
    });
}
exports.DeleteComentario = function(req,res){
   // console.log("delete: ", req.body);
        connection.connection.query("delete from  COMENTARIO  where  id=?",[req.body.id ],function(error, results2, fields){
            if(error) throw error;
        res.send(JSON.stringify(results2));
        });
}