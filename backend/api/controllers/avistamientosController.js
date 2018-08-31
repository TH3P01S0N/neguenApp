'use strict';
var mysql = require('mysql');
var fs = require('fs');
var connection = require("../../config/db");

function insertAmenaza(records){
    var sql = "INSERT INTO AMENAZAS_detalle (idAmenaza, idAvistamiento, suelo)  VALUES ?";
    console.log(records);
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_amenaza ( amenaza, id, tipo){  //id: idAvistamiento, amenaza:[] 
    var records = [];
    //console.log("id: ", id);
    for (var i = 0, len = amenaza.length; i < len; i++) {
        records.push([amenaza[i], id, tipo ]);
    } 
       // console.log("length: ", records.length);
    if(records.length>0){
        insertAmenaza(records);
        return true;              
    }
    else return false;
}
function updateBorrado(borrado, id){
    connection.connection.query("UPDATE  AVISTAMIENTO SET borrado=? where id=?", [borrado, id ], function(error, results, fields){
        if(error) throw error;
          });
}
exports.avistamiento_amenaza = function(req,res){
    var amenaza = req.body.amenaza;
    var suelo = req.body.suelo;
    if(amenaza!='/'){
        select_amenaza(amenaza,req.body.id, 'no');
    }
    if(suelo!='/'){
        select_amenaza(suelo,req.body.id, 'si');
    }
    return res.send({'success': true, 'message': 'Avistamiento creado'});
}
exports.edit_amenaza = function(req,res){
    var amenaza = req.body.amenaza;
    var suelo = req.body.suelo;
     if(req.body.id){
    connection.connection.query("UPDATE  AVISTAMIENTO SET descripcion=? where id=?", [req.body.descripcion, req.body.id ], function(error, results, fields){
            if(error) throw error;
              });
     connection.connection.query("DELETE from  AMENAZAS_detalle  where idAvistamiento=?",[  req.body.id], function(error, results, fields){
         if(error) throw error;
         if(amenaza!='/'){
            select_amenaza(amenaza,req.body.id, 'no');
        }
        if(suelo!='/'){
            select_amenaza(suelo,req.body.id, 'si');
        }
         res.send({'success': true, 'message': 'Avistamiento actualizado'});
        });
     }
     else res.send({'success': false, 'message': 'Hubo un problema modificando'});
 }

exports.avistamiento_create = function(req, res){
    var newAvist = {
        latitude: req.body.latitude,
        longitude: req.body.longitude,        
        foto: req.body.foto,
        fecha: req.body.fecha,
        temp: req.body.temp,
        idEspecie: req.body.especie,  //1
        idGrupoEspecie: req.body.grupoEspecie,
        idUsuario: null,
        descripcion: req.body.comentario,
        borrado:'no',
        localidad:req.body.localidad
      }
    var path = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email;
    var source = "/home/ubuntu/neguen/public/images/temp/" + req.body.foto;
    var dest = path + '/' + req.body.foto;
    fs.rename(source, dest, (err) => {
        if (err) throw err;
     //console.log("destino: ", dest);
    });
    console.log(req.body);
    connection.connection.query("SELECT id FROM USUARIO WHERE email = ? ", req.body.email,function(error, results, fields ){
        if(error) throw error;
        if(results.length<0){
            return res.send({'success': false, 'message': 'Hubo un problema agregando el avistamiento'});
        }
        else{
            newAvist.idUsuario=results[0].id;
            //console.log("insert avist: ", newAvist);
            connection.connection.query("INSERT INTO AVISTAMIENTO SET ?", newAvist, function(error, results, fields){
                if(error) throw error;
              //  if(res.headersSent)
             //       console.log("avistamiento creado ");
             //   else console.log("enviado");
                 res.send({
                    success:true,
                    message: results.insertId
                });
             //   if(res.headersSent) 
            //        console.log("no enviado2");
            //    else console.log("enviado2");
            });
        }
    });
};

exports.getAmenazaLatLng = function(req,res){
    connection.connection.query("select id, latitude, longitude, idGrupoEspecie from AVISTAMIENTO where borrado='no'", function(error, results, fields){
        if(error) throw error;
       res.send(JSON.stringify(results));
 
       });
}
exports.getAmenazaFoto = function(req,res){
    connection.connection.query("select foto from AVISTAMIENTO where id=?", [req.body.id] , function(error, results, fields){
        if(error) throw error;
       res.send(JSON.stringify(results.foto));
 
       });
}
exports.getAmenazas = function(req,res){
    var grupos=["Hongos", "Anfibios y reptiles", "Mamíferos" , "Aves" , "Plantas y algas" , "Invertebrados marinos" , "Artrópodos terrestres", "Peces" ]
    connection.connection.query("select  AVISTAMIENTO.foto, AVISTAMIENTO.fecha, AVISTAMIENTO.idEspecie,  AVISTAMIENTO.localidad, AVISTAMIENTO.descripcion, temp, idGrupoEspecie,  AVISTAMIENTO.idUsuario, latitude, longitude from AVISTAMIENTO where  AVISTAMIENTO.id=?",[req.body.id], function(error, results, fields){
        if(error) throw error;
        console.log("req body ", req.body );
        console.log("results: ", results);
        
        var resultado = {
        fecha:results[0].fecha, foto: results[0].foto, temp:results[0].temp, idGrupoEspecie:results[0].idGrupoEspecie, nombre: grupos[results[0].idGrupoEspecie-1], amenaza:[], suelo:[], localidad:results[0].localidad,
          nombreCient:" ", idEspecie:results[0].idEspecie,  idUsuario:results[0].idUsuario, latitude:results[0].latitude, longitude:results[0].longitude, likes:0, liked:false, descripcion:results[0].descripcion
        }
        connection.connection.query("select idAmenaza from AMENAZAS_detalle where idAvistamiento=? and suelo='no';",[ req.body.id], function(error, resultAmenaza, fields){
            if(error) throw error;
            resultado.amenaza=resultAmenaza;
            connection.connection.query("select idAmenaza from AMENAZAS_detalle where idAvistamiento=? and suelo='si';",[ req.body.id], function(error, resultSuelo, fields){
                if(error) throw error;
                resultado.suelo=resultSuelo;
                connection.connection.query("select  count(LIKE.id) as mg from AVISTAMIENTO, neguen_db.LIKE where AVISTAMIENTO.id=LIKE.idPost and LIKE.categoria='A' and AVISTAMIENTO.id=?",[req.body.id], function(error, resul, fields){
                    if(error) throw error;
                    if(resul.length < 1){
                        resultado.likes=0;
                    // select  AVISTAMIENTO.foto, temp, idGrupoEspecie, ESPECIE.nombre, AVISTAMIENTO.idUsuario, latitude, longitude from AVISTAMIENTO, ESPECIE  where ESPECIE.id=AVISTAMIENTO.idEspecie and AVISTAMIENTO.id=
                    }
                else {
                    resultado.likes=resul[0].mg;
                // return res.send(JSON.stringify(resultado));//res.send({'success': true, 'message': results[0].mg});
                }
                console.log("email: ", req.body.email);
                connection.connection.query("select  lk.mg from (select LIKE.idPost, LIKE.idUsuario, LIKE.categoria, count(LIKE.id) as mg from neguen_db.LIKE where categoria='A' group by LIKE.idPost, LIKE.idUsuario) as lk,AVISTAMIENTO, USUARIO where AVISTAMIENTO.id=lk.idPost and lk.idUsuario=USUARIO.id and USUARIO.email=? and AVISTAMIENTO.id=?",[req.body.email, req.body.id], function(error, resultLiked, fields){
                    if(error) throw error;
                    console.log("resultLiked: ", resultLiked);
                    if(resultLiked.length < 1) resultado.liked=false;
                    else resultado.liked=true;
                    if(resultado.idEspecie!=0){
                        connection.connection.query("select   ESPECIE.nombreCient,   ESPECIE.nombre from AVISTAMIENTO, ESPECIE where ESPECIE.id=AVISTAMIENTO.idEspecie and AVISTAMIENTO.id=?",[req.body.id], function(error, results_especie, fields){
                            if(error) throw error;
                           // console.log("result especie: ", results_especie);
                            resultado.nombre=results_especie[0].nombre;
                            resultado.nombreCient=results_especie[0].nombreCient;
                            console.log("resultado ", resultado);
                            return res.send(JSON.stringify(resultado));
                        });}
                    else {
                        return res.send(JSON.stringify(resultado));
                    }
                });
            });
        });
    });


      // res.send(JSON.stringify(resultado));//results[0]));
 
       });
}
exports.MisAmenazas = function(req,res){
    connection.connection.query("select  AVISTAMIENTO.foto, temp, idGrupoEspecie, AVISTAMIENTO.localidad,  ESPECIE.nombre , idEspecie, AVISTAMIENTO.id, latitude, longitude  from AVISTAMIENTO, USUARIO, ESPECIE where AVISTAMIENTO.idEspecie=ESPECIE.id and AVISTAMIENTO.idUsuario=USUARIO.id and AVISTAMIENTO.borrado='no' and USUARIO.email=?",[req.body.email], function(error, results, fields){
        if(error) throw error;
       res.send(JSON.stringify(results));
 
       });
}
exports.MisAmenazasLikeComents = function(req, res){
    var grupoEspecie = ["Hongo", "Anfibios y reptiles","Mamíferos","Aves", "Plantas y algas","Invertebrados marinos","Artrópodos terrestres","Peces"];
    var query="select AVISTAMIENTO.id as idAvist, AVISTAMIENTO.foto, AVISTAMIENTO.latitude,AVISTAMIENTO.idGrupoEspecie, AVISTAMIENTO.longitude,AVISTAMIENTO.localidad, AVISTAMIENTO.localidad as nombre,   fecha from  AVISTAMIENTO, USUARIO where AVISTAMIENTO.idUsuario=USUARIO.id  and  AVISTAMIENTO.borrado='no'and USUARIO.email=?";
    var query2 = "select count(*) as mg, AVISTAMIENTO.id, USUARIO.email as email_like from neguen_db.LIKE, AVISTAMIENTO, USUARIO where USUARIO.id=LIKE.idUsuario and USUARIO.email=? and LIKE.idPost=AVISTAMIENTO.id and LIKE.categoria='A' group by AVISTAMIENTO.id";
    var query3 = "select COMENTARIO.descripcion, idPost, COMENTARIO.id, USUARIO.nombre from COMENTARIO, AVISTAMIENTO, USUARIO where USUARIO.id=AVISTAMIENTO.idUsuario and idPost=AVISTAMIENTO.id and USUARIO.email=?";
    var query4 = "select AVISTAMIENTO.id, ESPECIE.nombre from AVISTAMIENTO, ESPECIE, USUARIO WHERE AVISTAMIENTO.idEspecie=ESPECIE.id and AVISTAMIENTO.idUsuario=USUARIO.id and USUARIO.email=?";
    connection.connection.query(query,[ req.body.email], function(error, result, fields){
        var resultado = {avistamientos:result, likes:null, comentarios:null};
        if(error) throw error;
        connection.connection.query(query4,[ req.body.email], function(error, resultEspec, fields){
            if(error) throw error;
            for (var i = 0, len = resultado.avistamientos.length; i < len; i++){
                for (var j = 0, len_ = resultEspec.length; j < len_; j++) {
                    if(resultado.avistamientos[i].idAvist==resultEspec[j].id){
                        resultado.avistamientos[i].nombre=resultEspec[j].nombre;
                    }
                    else {
                        resultado.avistamientos[i].nombre= grupoEspecie[resultado.avistamientos[i].idGrupoEspecie];
                    }
                }
            }
            connection.connection.query(query2,[ req.body.email], function(error, resultLikes, fields){
                if(error) throw error;
                resultado.likes=resultLikes;
                connection.connection.query(query3,[ req.body.email], function(error, resultComments, fields){
                    if(error) throw error;
                    resultado.comentarios=resultComments;
                    return res.send(resultado);
                });
            });
        });
    });
}
exports.AvistLikeComents = function(req, res){
    var grupoEspecie = ["Hongo", "Anfibios y reptiles","Mamíferos","Aves", "Plantas y algas","Invertebrados marinos","Artrópodos terrestres","Peces"];
    var query="select AVISTAMIENTO.id as idAvist, AVISTAMIENTO.foto, AVISTAMIENTO.latitude,AVISTAMIENTO.idGrupoEspecie, AVISTAMIENTO.localidad as nombreEsp, AVISTAMIENTO.longitude, USUARIO.email, USUARIO.nombre, fecha from AVISTAMIENTO, USUARIO where AVISTAMIENTO.idUsuario=USUARIO.id  and AVISTAMIENTO.borrado='no' ORDER BY idAvist DESC";
    var query2 = "select count(*) as mg, AVISTAMIENTO.id, USUARIO.email as email_like from neguen_db.LIKE, AVISTAMIENTO, USUARIO where USUARIO.id=LIKE.idUsuario  and LIKE.idPost=AVISTAMIENTO.id and LIKE.categoria='A' group by AVISTAMIENTO.id";
    var query3 = "select COMENTARIO.descripcion, idPost, COMENTARIO.id, USUARIO.nombre from COMENTARIO, AVISTAMIENTO, USUARIO where USUARIO.id=AVISTAMIENTO.idUsuario and idPost=AVISTAMIENTO.id";
    var query4 = "select AVISTAMIENTO.id, ESPECIE.nombre from AVISTAMIENTO, ESPECIE WHERE AVISTAMIENTO.idEspecie=ESPECIE.id";
    connection.connection.query(query, function(error, result, fields){
        var resultado = {avistamientos:result, likes:null, comentarios:null};
        if(error) throw error;
        connection.connection.query(query4, function(error, resultEspec, fields){
            if(error) throw error;
            for (var i = 0, len = resultado.avistamientos.length; i < len; i++){
                for (var j = 0, len_ = resultEspec.length; j < len_; j++) {
                    if(resultado.avistamientos[i].idAvist==resultEspec[j].id){
                        resultado.avistamientos[i].nombreEsp=resultEspec[j].nombre;
                    }
                    else {
                        resultado.avistamientos[i].nombreEsp= grupoEspecie[resultado.avistamientos[i].idGrupoEspecie-1];
                    }
                }
            } 
            connection.connection.query(query2, function(error, resultLikes, fields){
                //console.log("avist ", resultado.avistamientos);
                if(error) throw error;
                resultado.likes=resultLikes;
                connection.connection.query(query3, function(error, resultComments, fields){
                    if(error) throw error;
                    resultado.comentarios=resultComments;
                    return res.send(resultado);
                });
            });
        });
    });
}
exports.editTemp = function(req,res){
    if(req.body.id){
    connection.connection.query("UPDATE  AVISTAMIENTO SET temp=? where id=?",[req.body.temp, req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Avistamiento actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el avistamiento'});
}
exports.editGrupos = function(req,res){
    if(req.body.id){
    connection.connection.query("UPDATE  AVISTAMIENTO SET idGrupoEspecie=? where id=?",[req.body.idGrupoEspecie, req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Avistamiento actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el avistamiento'});
}
exports.editUbica = function(req,res){
    if(req.body.id){
    connection.connection.query("UPDATE  AVISTAMIENTO SET localidad=?, longitude=?, latitude=? where id=?",[req.body.localidad, req.body.longitude, req.body.latitude , req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Avistamiento actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el avistamiento'});
}
exports.editEspecie = function(req,res){
    if(req.body.id){
    connection.connection.query("UPDATE  AVISTAMIENTO SET idEspecie=?, idGrupoEspecie=? where id=?",[req.body.idEspecie, req.body.idGrupoEspecie, req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Avistamiento actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el avistamiento'});
}
exports.editfoto = function(req,res){
    if(req.body.id){
        var email = ""
        connection.connection.query("select email from AVISTAMIENTO, USUARIO WHERE AVISTAMIENTO.idUsuario=USUARIO.id and AVISTAMIENTO.id= ? ", req.body.id,function(error, resultsEmail, fields ){
            if(error) throw error;
            email=resultsEmail[0].email;
            var path = "/home/ubuntu/neguen/public/images/uploads/"+ email;
            var source = "/home/ubuntu/neguen/public/images/temp/" + req.body.foto;
            var dest = path + '/' + req.body.foto;
            if(req.body.foto!=null){
                fs.rename(source, dest, (err) => {
                    if (err) throw err;
                //console.log("destino: ", dest);
                });
                fs.unlink(path+"/"+req.body.fotoOld, (err) => {
                    if (err) throw err;
                });
                connection.connection.query("UPDATE  AVISTAMIENTO SET foto=? where id=?",[req.body.foto, req.body.id], function(error, results, fields){
                    if(error) throw error;
                    res.send({'success': true, 'message': 'AVISTAMIENTO actualizado'});
                });
            }
        })
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando la especie'});

}
exports.editAmenazas = function(req,res){
    // console.log("req edit obj: ", req.body);
     if(req.body.id){
     connection.connection.query("DELETE from  AMENAZAS_detalle  where suelo=? and idAvistamiento=?",[req.body.suelo, req.body.id], function(error, results, fields){
         if(error) throw error;
         select_amenaza(req.body.amenaza, req.body.id, req.body.suelo);
         res.send({'success': true, 'message': 'Amenaza actualizado'});
        });
     }
     else res.send({'success': false, 'message': 'Hubo un problema modificando el avistamiento'});
 }
exports.deleteAvist = function (req, res){
   // console.log("body: ", req.body);
   // var path = "/home/ubuntu/neguen/deletes/"+ req.body.email;
   // var source = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email + '/' + req.body.email + '.jpg' ; 
    /*if (fs.existsSync(source)){ 
        createFolder(path, function(err) {
            if (err) throw err; // handle folder creation error
        // else console.log("mkdir "); // we're all good
        });
        var dest = path  + '/' + req.body.email + '.jpg';     
        fs.rename(source, dest, (err) => {
            if (err) throw err;
        }); 
    }*/
    updateBorrado('si', req.body.id);
    //BORRAR TAMBIEN LOS AVIST
    return res.send({'success': true, 'message': 'Avistamiento eliminado!'});
}

exports.getLikes = function (req, res) {
    connection.connection.query("select  count(LIKE.id) as mg from AVISTAMIENTO, neguen_db.LIKE where AVISTAMIENTO.id=LIKE.idPost and AVISTAMIENTO.id=?",[req.body.id], function(error, results, fields){
        if(error) throw error;
        if(results.length < 1){
            return res.send({'success': true, 'message': 0});
        }
       else {
        return res.send({'success': true, 'message': results[0].mg});
       }
 
       });
}
