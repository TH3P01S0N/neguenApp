'use strict';
var mysql = require('mysql');
var connection = require("../../config/db");
  //Task = mongoose.model('Tasks');

  


exports.list_all = function(req, res) {
    connection.connection.query("select * from GRUPO_ESPECIE", function(error, results, fields){
        if(error) throw error;
            console.log(results);
       res.send(JSON.stringify(results));
 
       });
  /*Task.find({}, function(err, task) {
    if (err)
      res.send(err);
    res.json(task);
  });*/
};
exports.Getgrupos = function(req, res) {
  var email = req.body.email;
    if(!email){
        email= "-";
    }
  connection.connection.query("select idGrupoEspecie from GRUPO_ESPECIE_detalle_usr, USUARIO where GRUPO_ESPECIE_detalle_usr.idUsuario=USUARIO.id and USUARIO.email= ?",[email], function(err, row, fields){
    if(err) console.log(err);  
    if(row.length < 1){
        //res.send({'success': true, 'message': row[0].username});
        return res.send({'success': false, 'message': 'Hubo un problema'});
      }
      else{
        res.send({
                success:true,
                'message': row
        });
      }
    });
    };