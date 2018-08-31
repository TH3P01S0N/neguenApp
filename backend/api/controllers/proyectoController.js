'use strict';
var mysql = require('mysql');
var fs = require('fs');
var xl = require('excel4node');
var connection = require("../../config/db");
var mails = require("./mailController");

function insertGrupos(records){
    var sql = "INSERT INTO GRUPO_ESPECIE_detalle (idProyecto, idGrupoEspecie)  VALUES ?";
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_grupos (idProyecto, grupos){
    var records = [];
   // console.log("id: ", idProyecto);
    for (var i = 0, len = grupos.length; i < len; i++) {
        records.push([idProyecto, grupos[i] ]);
    } 
       // console.log("length: ", records.length);
    if(records.length>0){
        insertGrupos(records);
        return true;              
    }
    else return false;
}
function insertUbicacion(records){
    var sql = "INSERT INTO UBICACION (idProyecto, latitude, longitude)  VALUES ?";
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_ubicacion (idProyecto, ubicacion){
    var records = [];
   // console.log("ubicacion: ", ubicacion[0].latitude);
    for (var i = 0, len = ubicacion.length; i < len; i++) {
        records.push([idProyecto, ubicacion[i].latitude, ubicacion[i].longitude ]);
    } 
       // console.log("length: ", records.length);
    if(records.length>0){
        insertUbicacion(records);
        return true;              
    }
    else return false;
}
function insertUsuarios(records){
    var sql = "INSERT INTO GRUPO_PROYECTO (idUsuarios, idProyecto)  VALUES ?";
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_usuarios (idProyecto, usuarios){
    var records = [];
    console.log("id: ", idProyecto);
    for (var i = 0, len = usuarios.length; i < len; i++) {
        records.push([ usuarios[i], idProyecto ]);
    } 
       // console.log("length: ", records.length);
    if(records.length>0){
        insertUsuarios(records);
        return true;              
    }
    else return false;
}
function insertEspecies(records){
    var sql = "INSERT INTO PROYECTO_ESPEC (idEspecie, idProyecto)  VALUES ?";
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_especies (idProyecto, especies){
    var records = [];
   // console.log("id: ", idProyecto);
    for (var i = 0, len = especies.length; i < len; i++) {
        records.push([ especies[i].idEspecie, idProyecto ]);
    } 
       // console.log("especeis: ", records, especies);
    if(records.length>0){
        insertEspecies(records);
        return true;              
    }
    else return false;
}
exports.proyecto_create = function(req, res){
    var newProyecto = {        
        nombre: req.body.nombre,
        pregunta: req.body.pregunta,
        objetivos: req.body.objetivos,
        idUsuarioDuenio: null,
        borrado:'no'
      }
   // console.log(req.body);
    connection.connection.query("SELECT id FROM USUARIO WHERE email = ? ", req.body.email,function(error, results, fields ){
        if(error) throw error;
        if(results.length<0){
            return res.send({'success': false, 'message': 'Hubo un problema agregando el proyecto'});
        }
        else{
            newProyecto.idUsuarioDuenio=results[0].id;
                connection.connection.query("INSERT INTO PROYECTO SET ?", newProyecto, function(error, results, fields){
                    if(error) throw error;
                    select_grupos(results.insertId, req.body.grupoEspecie);
                    select_ubicacion(results.insertId, req.body.polylines[0].coordinates);
                    select_usuarios(results.insertId, req.body.usuarios);
                    select_especies(results.insertId, req.body.especie);
                     res.send({
                        success:true,
                        message: results.insertId
                     });
                });
        }
    });
};

exports.GetProyectos = function(req, res) {
    
    connection.connection.query("select  PROYECTO.id,PROYECTO.nombre, USUARIO.id as idUser , pregunta,  idUsuarioDuenio from PROYECTO, USUARIO where USUARIO.id=PROYECTO.idUsuarioDuenio and USUARIO.email=?", [req.body.email], function(error, results, fields){
        if(error) throw error;
        var resultado = {
            proyectos:results ,ubicacion:[]
        }
        if (results.length>0){
        var idUsuario = results[0].idUser;
        connection.connection.query("select latitude, longitude,idProyecto from UBICACION, PROYECTO where PROYECTO.id=UBICACION.idProyecto and PROYECTO.idUsuarioDuenio=?", [idUsuario] , function(error, resultUbica, fields){
            if(error) throw error;
            resultado.ubicacion = resultUbica;
            return res.send(JSON.stringify(resultado));
        });}
        else 
            return res.send(JSON.stringify(resultado));
    });
}

exports.ConsultarProyecto = function(req,res){
    connection.connection.query("select  nombre, pregunta, objetivos, idUsuarioDuenio, fecha_creac from PROYECTO  where  PROYECTO.id=?",[req.body.id], function(error, results, fields){
        if(error) throw error;
        console.log("req body ", req.body );
       // console.log("results: ", results);
        var resultado = {
            fecha_creac: results[0].fecha_creac,
            nombre: results[0].nombre, pregunta:results[0].pregunta, objetivos:results[0].objetivos, ubicacion:[],
            idUsuarioDuenio:results[0].idUsuarioDuenio, likes:0, liked:false, grupoEspecie:[], usuarios:[], especies:[]
        }
        connection.connection.query("select  count(LIKE.id) as mg from PROYECTO, neguen_db.LIKE where PROYECTO.id=LIKE.idPost and LIKE.categoria='P' and  PROYECTO.id=?",[req.body.id], function(error, resul, fields){
            if(error) throw error;
            if(resul.length < 1){
                resultado.likes=0;
               // return res.send(JSON.stringify(resultado));//return res.send({'success': true, 'message': 0});
            }
           else {
            resultado.likes=resul[0].mg;
           // return res.send(JSON.stringify(resultado));//res.send({'success': true, 'message': results[0].mg});
           }
          // console.log("email: ", req.body.email);
           connection.connection.query("select  lk.mg from (select LIKE.idPost, LIKE.idUsuario, LIKE.categoria, count(LIKE.id) as mg from neguen_db.LIKE where categoria='P' group by LIKE.idPost, LIKE.idUsuario) as lk,PROYECTO, USUARIO where  PROYECTO.id=lk.idPost and lk.idUsuario=USUARIO.id and USUARIO.email=? and PROYECTO.id=?",[req.body.email, req.body.id], function(error, resultLiked, fields){
            if(error) throw error;
           // console.log("resultLiked: ", resultLiked);
            if(resultLiked.length < 1) resultado.liked=false;
            else resultado.liked=true;
            connection.connection.query("select idGrupoEspecie from GRUPO_ESPECIE_detalle where idProyecto=?",[ req.body.id], function(error, resultGrupoEspecie, fields){
                if(error) throw error;
                resultado.grupoEspecie=resultGrupoEspecie;
                connection.connection.query("select GRUPO_PROYECTO.id,idUsuarios, nombre, email from GRUPO_PROYECTO, USUARIO where GRUPO_PROYECTO.idUsuarios=USUARIO.id and idProyecto=?",[ req.body.id], function(error, resultUsuarios, fields){
                    if(error) throw error;
                    resultado.usuarios=resultUsuarios;
                    connection.connection.query("select latitude, longitude from UBICACION where idProyecto=?",[ req.body.id], function(error, resultUbica, fields){
                        if(error) throw error;
                        resultado.ubicacion = resultUbica;
                        connection.connection.query("select ESPECIE.id, grupoEspecie, nombre, nombreCient from PROYECTO_ESPEC, ESPECIE where PROYECTO_ESPEC.idEspecie=ESPECIE.id and idProyecto=?",[ req.body.id], function(error, resultEspecies, fields){
                            if(error) throw error;
                            resultado.especies = resultEspecies
                            return res.send(JSON.stringify(resultado));
                        });
                    });
                });
            });
            
     
           });
        });


      // res.send(JSON.stringify(resultado));//results[0]));
 
       });
}
exports.listProyecto = function(req,res){
    var proyectos= [];
    var equipo = [];
    var resultados = [];
    var cant = 0;
    connection.connection.query("select id, nombre, pregunta from PROYECTO where borrado='no'", function(error, results, fields){
        if(error) throw error;
        proyectos=results;
        connection.connection.query("select count(*) as equipo, idProyecto from GRUPO_PROYECTO, PROYECTO where GRUPO_PROYECTO.idProyecto=PROYECTO.id and PROYECTO.borrado='no' group by idProyecto", function(error, resultsEquipo, fields){
            if(error) throw error;
            equipo=resultsEquipo;
            for (var i = 0, len = proyectos.length ; i < len; i++) {
                var item = equipo.find(eq => eq.idProyecto==proyectos[i].id);
                if(item) cant = item.equipo;
                var item_object = {id:proyectos[i].id, nombre:proyectos[i].nombre, equipo: cant }
                resultados.push(item_object);
                cant = 0;
            } 
           // console.log(resultados);
            res.send(JSON.stringify(resultados));
        });
       
 
       });
}
exports.getProyectoEquipo = function(req,res){
    var respuesta = [];
    var listado = [];
    connection.connection.query("select id, nombre, email from USUARIO where borrado='no'", function(error, results, fields){
        if(error) throw error;
        listado = results;
        //console.log("listado ", listado);
        connection.connection.query("select idUsuarios from GRUPO_PROYECTO where  idProyecto=?", req.body.id , function(error, resultsEquipo, fields){
            if(error) throw error;
                for (var i = 0, len = listado.length; i < len; i++){
                    let index = resultsEquipo.findIndex(el => el.idUsuarios === listado[i].id);
                    if(index>-1)
                        respuesta.push({emails: listado[i].email, press:true, fotos: "--", id: listado[i].id})
                    else 
                        respuesta.push({emails: listado[i].email, press:false, fotos: "--", id: listado[i].id})

                }
                var data = {dat: listado, respuesta: respuesta};
                //console.log("respuesta: ", respuesta);
                    res.send(JSON.stringify(data));
        });
    });
}
exports.editObjetivos = function(req,res){
   // console.log("req edit obj: ", req.body);
    if(req.body.id){
    connection.connection.query("UPDATE  PROYECTO SET pregunta=?, objetivos=? where id=?",[req.body.pregunta, req.body.objetivos,  req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Proyecto actualizada'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el proyecto'});
}
exports.editNombre = function(req,res){
    //console.log("req edit obj: ", req.body);
    if(req.body.id){
    connection.connection.query("UPDATE  PROYECTO SET nombre=? where id=?",[req.body.nombre,  req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Proyecto actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el proyecto'});
}
exports.editGrupos = function(req,res){
   // console.log("req edit obj: ", req.body);
    if(req.body.id){
    connection.connection.query("DELETE from  GRUPO_ESPECIE_detalle  where idProyecto=?",[  req.body.id], function(error, results, fields){
        if(error) throw error;
        select_grupos(req.body.id, req.body.grupoEspecie);
        res.send({'success': true, 'message': 'Proyecto actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el proyecto'});
}
exports.editEspecies = function(req,res){
    // console.log("req edit obj: ", req.body);
     if(req.body.id){
     connection.connection.query("DELETE from  PROYECTO_ESPEC  where idProyecto=?",[  req.body.id], function(error, results, fields){
         if(error) throw error;
         select_especies(req.body.id, req.body.especies);
         res.send({'success': true, 'message': 'Proyecto actualizado'});
        });
     }
     else res.send({'success': false, 'message': 'Hubo un problema modificando el proyecto'});
 }
 exports.editEquipo = function(req,res){
    // console.log("req edit obj: ", req.body);
     if(req.body.id){
     connection.connection.query("DELETE from  GRUPO_PROYECTO  where idProyecto=?",[  req.body.id], function(error, results, fields){
         if(error) throw error;
         select_usuarios(req.body.id, req.body.usuarios);
         res.send({'success': true, 'message': 'Proyecto actualizado'});
        });
     }
     else res.send({'success': false, 'message': 'Hubo un problema modificando el proyecto'});
 }
exports.editArea = function(req,res){
    // console.log("req edit obj: ", req.body);
     if(req.body.id){
     connection.connection.query("DELETE from  UBICACION   where idProyecto=?",[  req.body.id], function(error, results, fields){
         if(error) throw error;
         select_ubicacion(req.body.id, req.body.ubicacion[0].coordinates);
         res.send({'success': true, 'message': 'Proyecto actualizado'});
        });
     }
     else res.send({'success': false, 'message': 'Hubo un problema modificando el proyecto'});
 }
 exports.proyectoAvist = function(req, res){
    var query="select AVISTAMIENTO.id as idAvist, AVISTAMIENTO.idEspecie,  AVISTAMIENTO.foto, AVISTAMIENTO.latitude,AVISTAMIENTO.idGrupoEspecie, AVISTAMIENTO.longitude, AVISTAMIENTO.localidad, USUARIO.email, USUARIO.nombre, fecha from  AVISTAMIENTO, USUARIO where AVISTAMIENTO.idUsuario=USUARIO.id  and AVISTAMIENTO.borrado='no'";
    var query2 = "select count(*) as mg, AVISTAMIENTO.id, USUARIO.email as email_like from neguen_db.LIKE, AVISTAMIENTO, USUARIO where USUARIO.id=LIKE.idUsuario  and LIKE.idPost=AVISTAMIENTO.id and LIKE.categoria='A' group by AVISTAMIENTO.id";
    var query3 = "select COMENTARIO.descripcion, idPost, COMENTARIO.id, USUARIO.nombre from COMENTARIO, AVISTAMIENTO, USUARIO where USUARIO.id=AVISTAMIENTO.idUsuario and idPost=AVISTAMIENTO.id";
    connection.connection.query(query, function(error, result, fields){
        var resultado = {avistamientos:result, likes:null, comentarios:null};
        if(error) throw error;
        connection.connection.query(query2, function(error, resultLikes, fields){
            if(error) throw error;
            resultado.likes=resultLikes;
            connection.connection.query(query3, function(error, resultComments, fields){
                if(error) throw error;
                resultado.comentarios=resultComments;
                return res.send(resultado);
            });
        });
    });
}
exports.proyectoAvistMap = function(req, res){
    var query="select AVISTAMIENTO.id as idAvist, AVISTAMIENTO.latitude, AVISTAMIENTO.longitude, AVISTAMIENTO.idGrupoEspecie  from  AVISTAMIENTO where   AVISTAMIENTO.borrado='no'";
    var query2 = "select count(*) as mg, AVISTAMIENTO.id from neguen_db.LIKE, AVISTAMIENTO where AVISTAMIENTO.idEspecie=? and LIKE.idPost=AVISTAMIENTO.id and LIKE.categoria='A' group by AVISTAMIENTO.id";

    connection.connection.query(query, function(error, result, fields){
       // var resultado = {avistamientos:result};
        if(error) throw error;
        return res.send(result);
    });
}
 exports.excel = function(req, res) {
     console.log("body ", req.body);
    var grupoEspecie = ["Hongo", "Anfibios y reptiles","Mamíferos","Aves", "Plantas y algas","Invertebrados marinos","Artrópodos terrestres","Peces"];
    var wb = new xl.Workbook();
    var ws = wb.addWorksheet('Sheet 1');
    
    var style = wb.createStyle({
        font: {
          color: '#FF0800',
          size: 12,
        },
        numberFormat: '$#,##0.00; ($#,##0.00); -',
      });
  //  ws.cell(1, 1)
  //    .number(100)
  //    .style(style);
    ws.cell(1,1).string("Id");
    ws.cell(1,2).string("Fecha");
    ws.cell(1,3).string("Localidad");
    ws.cell(1,4).string("Longitud");
    ws.cell(1,5).string("Latitud");
    ws.cell(1,6).string("Grupo de especie");
    ws.cell(1,7).string("Usuario");
    ws.cell(1,8).string("Nombre especie");
    ws.cell(1,9).string("Nombre científico");
   for (var i = 0, len = req.body.avistamientos.length; i < len; i++){
        ws.cell(i+2,1).number(i);
        ws.cell(i+2,2).string(req.body.avistamientos[i].fecha);
        ws.cell(i+2,3).string(req.body.avistamientos[i].localidad);
        ws.cell(i+2,4).number(req.body.avistamientos[i].coords.longitude);
        ws.cell(i+2,5).number(req.body.avistamientos[i].coords.latitude);
        ws.cell(i+2,6).string(grupoEspecie[req.body.avistamientos[i].idGrupoEspecie-1]);
        ws.cell(i+2,7).string(req.body.avistamientos[i].nombre);
        if(req.body.avistamientos[i].nombreEsp)
            ws.cell(i+2,8).string(req.body.avistamientos[i].nombreEsp);
        else 
            ws.cell(i+2,8).string(grupoEspecie[req.body.avistamientos[i].idGrupoEspecie-1]);
        if (req.body.avistamientos[i].nombreCient)
            ws.cell(i+2,9).string(req.body.avistamientos[i].nombreCient);
        else    
            ws.cell(i+2,9).string(grupoEspecie[req.body.avistamientos[i].idGrupoEspecie-1]);
    }
  //  ws.cell(2,2).string("03/05/2018");
  //  ws.cell(2,4).number(3.45645654).style(style);
  //  ws.cell(2,5).number(3.45645654);
  //console.log("write: ", wb.write('proyecto'+req.body.id+req.body.email_duenio+ Math.floor((Math.random() * 999999) + 1000000)+ '.xlsx' ));
  /*wb.write('proyecto.xlsx', function(err, stats) {
    if (err) {
      console.error(err);
    } else {
      console.log(stats); // Prints out an instance of a node.js fs.Stats object
    }
  });*/
  wb.writeToBuffer().then(function(buffer) {
     mails.enviar_excel(buffer, req.body.email_duenio, 'proyecto'+req.body.id+req.body.email_duenio+ Math.floor((Math.random() * 999999) + 1000000)+ '.xlsx', req.body.nombre )
  });
  res.send({'success': true, 'message': 'Excel enviado'});
  };