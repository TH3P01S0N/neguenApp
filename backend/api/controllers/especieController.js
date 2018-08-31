'use strict';
var mysql = require('mysql');
var fs = require('fs');
var connection = require("../../config/db");


function insertUbicacion(records){
    var sql = "INSERT INTO UBICACION_ESPEC (idEspecie, latitude, longitude)  VALUES ?";
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_ubicacion (idEspecie, ubicacion){
    var records = [];
   // console.log("ubicacion: ", ubicacion[0].latitude);
    for (var i = 0, len = ubicacion.length; i < len; i++) {
        records.push([idEspecie, ubicacion[i].latitude, ubicacion[i].longitude ]);
    } 
       // console.log("length: ", records.length);
    if(records.length>0){
        insertUbicacion(records);
        return true;              
    }
    else return false;
}
exports.insertUbic = function(req,res){
    select_ubicacion(req.body.idEspecie, req.body.polylines[0].coordinates);
    res.send({'success': true, 'message': 'Especie insertada'});
}
exports.getNombreEspecie = function(req,res){
    connection.connection.query("select id, nombre, nombreCient, grupoEspecie from ESPECIE where borrado='no'", function(error, results, fields){
        if(error) throw error;
       res.send(JSON.stringify(results));
 
       });
}
exports.especie_exist = function(req,res){
    connection.connection.query("select id from ESPECIE where nombre=?",req.body.nombre , function(error, results, fields){
        if(error) throw error;
        if(results.length>0 && req.body.modulo!="especie" ){
            return res.send({'success': false, 'message': 'Ya existe esta especie'}); 
        }
        else {
            if(req.body.modulo=="especie"){
            console.log("bodt exist: ", req.body);
            connection.connection.query("UPDATE  ESPECIE SET nombre=?, nombreCient=? where id=?",[req.body.nombre, req.body.nombreCient, req.body.id], function(error, results, fields){
                if(error) throw error;
                return res.send({'success': true, 'message': 'No existe esta especie'});
            });
            }
            else {
                return res.send({'success': true, 'message': 'No existe esta especie'});
            }

            
        }
       //res.send(JSON.stringify(results));
 
       });
}

exports.especie_create = function(req, res){
    var newEspecie = {        
        nombre: req.body.nombre,
        nombreCient: req.body.nombreCient,
        grupoEspecie: req.body.grupoEspecie,
        foto: req.body.foto,
        AutorFoto: req.body.AutorFoto , //req.body.especie,
        procedencia: req.body.procedencia,
        idUsuario: null,
        descripcion: '',
        estadoConservacion: req.body.estadoConservacion,
        borrado:'no'
      }
   //   console.log("req: ", req.body);
    if(req.body.modulo!="especie"){
        if(req.body.modulo!="editAvist"){          
             var path = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email;
            var source = "/home/ubuntu/neguen/public/images/temp/" + req.body.foto;
            var dest = path + '/' + req.body.foto;
            console.log("destino: ", dest);
            if(newEspecie.foto!='/')
            fs.rename(source, dest, (err) => {
                if (err) throw err;
            //
            });
            
    }}
    if(req.body.modulo=="editAvist" ){
        
        if(req.body.cambioFoto){
            console.log("cambio ", req.body.cambioFoto);
            var path = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email;
            var source = "/home/ubuntu/neguen/public/images/temp/" + req.body.foto;
            var dest = path + '/' + req.body.foto;
            console.log("edit - cambio ", dest);
            fs.rename(source, dest, (err) => {
                if (err) throw err;
            });
        } else {
            var path = "/home/ubuntu/neguen/public/";           
            var imagenURL = req.body.imagen.uri;
            var strSplit = imagenURL.split("amazonaws.com/");
            var nombreFoto = strSplit[1].split("/");
            console.log("nombreFoto: ", nombreFoto[3]);
            var source = path + "images/uploads/" + req.body.email + "/" + req.body.foto;
            var rd = fs.createReadStream(path+strSplit[1]);
            rd.on("error", function(err) {
                if (err) throw err;
            });
            var wr = fs.createWriteStream(source);
            wr.on("error", function(err) {
                if (err) throw err;
            });
            wr.on("close", function(ex) { 
            });
            rd.pipe(wr);}
    }
    console.log(req.body);
    connection.connection.query("SELECT id FROM USUARIO WHERE email = ? ", req.body.email,function(error, results, fields ){
        if(error) throw error;
        if(results.length<0){
            return res.send({'success': false, 'message': 'Hubo un problema agregando la especie'});
        }
        else{
            newEspecie.idUsuario=results[0].id;
            if(req.body.modulo=='especie'){
                console.log("req.body: ", req.body);
                connection.connection.query("UPDATE  ESPECIE SET procedencia=?, estadoConservacion=?  where id=?",[req.body.procedencia, req.body.estadoConservacion, req.body.id], function(error, results, fields){
                    if(error) throw error;
                    return res.send({'success': true, 'message': 'se actualizo especie'});
                });
            }else {
                connection.connection.query("INSERT INTO ESPECIE SET ?", newEspecie, function(error, results, fields){
                    if(error) throw error;
                    var data ={idUsuario: newEspecie.idUsuario,  idPost:results.insertId, descripcion: req.body.descripcion, borrado:'no'};
                    if(data.descripcion.length>0){
                    connection.connection.query("insert into  COMENTARIO_esp  SET ?", data ,function(error, results2, fields){
                        if(error) throw error; 
                        res.send({
                            success:true,
                            message: data.idPost
                        });
                    });}
                    else{
                        res.send({
                            success:true,
                            message: data.idPost
                        });
                    }
                });
            }
        }
    });
};
exports.editfoto = function(req,res){
    if(req.body.id){
        var email = ""
        connection.connection.query("select email from ESPECIE, USUARIO WHERE ESPECIE.idUsuario=USUARIO.id and ESPECIE.id= ? ", req.body.id,function(error, resultsEmail, fields ){
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
                
                if(req.body.fotoOld!="-" && req.body.fotoOld!="/"){
                    console.log("fotoold ", req.body.fotoOld);
                    fs.unlink(path+"/"+req.body.fotoOld, (err) => {
                        if (err) throw err;
                    });
                 }
                connection.connection.query("UPDATE  ESPECIE SET foto=? where id=?",[req.body.foto, req.body.id], function(error, results, fields){
                    if(error) throw error;
                    res.send({'success': true, 'message': 'Especie actualizado'});
                });
            }
        })
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando la especie'});

}
exports.editGrupos = function(req,res){
    if(req.body.id){
    connection.connection.query("UPDATE  ESPECIE SET grupoEspecie=? where id=?",[req.body.idGrupoEspecie, req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Especie actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando la especie'});
}
exports.editEspecie = function(req,res){
    if(req.body.id){    //****************** */
    connection.connection.query("UPDATE  AVISTAMIENTO SET idEspecie=? where id=?",[req.body.idEspecie,  req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Avistamiento actualizado'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando el avistamiento'});
}
exports.editDescripcion = function(req,res){
    if(req.body.id){
    connection.connection.query("UPDATE  ESPECIE SET descripcion=? where id=?",[req.body.descripcion,  req.body.id], function(error, results, fields){
        if(error) throw error;
        res.send({'success': true, 'message': 'Especie actualizada'});
       });
    }
    else res.send({'success': false, 'message': 'Hubo un problema modificando la especie'});
}
exports.editArea = function(req,res){
    // console.log("req edit obj: ", req.body);
     if(req.body.id){
     connection.connection.query("DELETE from  UBICACION_ESPEC   where idEspecie=?",[  req.body.id], function(error, results, fields){
         if(error) throw error;
         select_ubicacion(req.body.id, req.body.ubicacion[0].coordinates);
         res.send({'success': true, 'message': 'Especie actualizado'});
        });
     }
     else res.send({'success': false, 'message': 'Hubo un problema modificando la especie'});
 }
exports.getEspecies = function(req,res){
    connection.connection.query("select  foto, fecha_creac, nombreCient, grupoEspecie, nombre, idUsuario, autorFoto, descripcion, procedencia, estadoConservacion from  ESPECIE  where ESPECIE.id=?",[req.body.id], function(error, results, fields){
        if(error) throw error;
        console.log("req body ", req.body );
        console.log("results: ", results);
        var resultado = {
            foto: results[0].foto, nombreCient:results[0].nombreCient, grupoEspecie:results[0].grupoEspecie, nombre:results[0].nombre,
             idUsuario:results[0].idUsuario, autorFoto:results[0].autorFoto, descripcion:results[0].descripcion, procedencia:results[0].procedencia
             , likes:0, liked:false, estadoConservacion:results[0].estadoConservacion, fecha_creac: results[0].fecha_creac,
             ubicacion:[]
        }
        connection.connection.query("select latitude, longitude from UBICACION_ESPEC where idEspecie=?",[ req.body.id], function(error, resultUbica, fields){
            if(error) throw error;
            resultado.ubicacion = resultUbica;
            connection.connection.query("select  count(LIKE.id) as mg from ESPECIE, neguen_db.LIKE where ESPECIE.id=LIKE.idPost and LIKE.categoria='E'  and ESPECIE.id=?",[req.body.id], function(error, resul, fields){
                if(error) throw error;
                if(resul.length < 1){
                    resultado.likes=0;
                // return res.send(JSON.stringify(resultado));//return res.send({'success': true, 'message': 0});
                }
            else {
                resultado.likes=resul[0].mg;
            // return res.send(JSON.stringify(resultado));//res.send({'success': true, 'message': results[0].mg});
            }
            console.log("email: ", req.body.email);
            connection.connection.query("select  lk.mg from (select LIKE.idPost, LIKE.idUsuario, LIKE.categoria, count(LIKE.id) as mg from neguen_db.LIKE where categoria='E' group by LIKE.idPost, LIKE.idUsuario) as lk,ESPECIE, USUARIO where ESPECIE.id=lk.idPost and lk.idUsuario=USUARIO.id and USUARIO.email=? and ESPECIE.id=?",[req.body.email, req.body.id], function(error, resultLiked, fields){
                if(error) throw error;
                console.log("resultLiked: ", resultLiked);
                if(resultLiked.length < 1) resultado.liked=false;
                else resultado.liked=true;
                return res.send(JSON.stringify(resultado));
        
            });
            });
        });
      // res.send(JSON.stringify(resultado));//results[0])); 
       });

}
exports.MisEspeciesLike = function(req, res){
    var query="select ESPECIE.id , ESPECIE.foto, ESPECIE.nombre,ESPECIE.grupoEspecie,ESPECIE.nombreCient from ESPECIE, USUARIO where ESPECIE.idUsuario=USUARIO.id  and ESPECIE.borrado='no'and USUARIO.email=?";
    var query2 = "select count(*) as mg, ESPECIE.id, USUARIO.email as email_like from neguen_db.LIKE, ESPECIE, USUARIO where USUARIO.id=LIKE.idUsuario and USUARIO.email=? and LIKE.idPost=ESPECIE.id and LIKE.categoria='E' group by ESPECIE.id";
    var query3 = "select COMENTARIO.descripcion, idPost, COMENTARIO.id, USUARIO.nombre from COMENTARIO, AVISTAMIENTO, USUARIO where USUARIO.id=AVISTAMIENTO.idUsuario and idPost=AVISTAMIENTO.id and USUARIO.email=?";
    connection.connection.query(query,[ req.body.email], function(error, result, fields){
        var resultado = {especies:result, likes:null, comentarios:null};
        if(error) throw error;
        connection.connection.query(query2,[ req.body.email], function(error, resultLikes, fields){
            if(error) throw error;
            resultado.likes=resultLikes;
         //   connection.connection.query(query3,[ req.body.email], function(error, resultComments, fields){
         //       if(error) throw error;
         //       resultado.comentarios=resultComments;
                return res.send(resultado);
        //    });
        });
    });
}
exports.especieAvist = function(req, res){
    var query="select AVISTAMIENTO.id as idAvist, AVISTAMIENTO.foto, AVISTAMIENTO.latitude,AVISTAMIENTO.idGrupoEspecie, AVISTAMIENTO.longitude,AVISTAMIENTO.localidad, USUARIO.email, USUARIO.nombre, fecha from ESPECIE, AVISTAMIENTO, USUARIO where AVISTAMIENTO.idUsuario=USUARIO.id and ESPECIE.id=? and ESPECIE.id=AVISTAMIENTO.idEspecie and AVISTAMIENTO.borrado='no'";
    var query2 = "select count(*) as mg, AVISTAMIENTO.id, USUARIO.email as email_like from neguen_db.LIKE, AVISTAMIENTO, USUARIO where USUARIO.id=LIKE.idUsuario and AVISTAMIENTO.idEspecie=? and LIKE.idPost=AVISTAMIENTO.id and LIKE.categoria='A' group by AVISTAMIENTO.id";
    var query3 = "select COMENTARIO.descripcion, idPost, COMENTARIO.id, USUARIO.nombre from COMENTARIO, AVISTAMIENTO, USUARIO where USUARIO.id=AVISTAMIENTO.idUsuario and idPost=AVISTAMIENTO.id and AVISTAMIENTO.idEspecie=?";
    connection.connection.query(query,[ req.body.id], function(error, result, fields){
        var resultado = {avistamientos:result, likes:null, comentarios:null};
        if(error) throw error;
        connection.connection.query(query2,[ req.body.id], function(error, resultLikes, fields){
            if(error) throw error;
            resultado.likes=resultLikes;
            connection.connection.query(query3,[ req.body.id], function(error, resultComments, fields){
                if(error) throw error;
                resultado.comentarios=resultComments;
                return res.send(resultado);
            });
        });
    });
}
exports.especieAvistMap = function(req, res){
    var query="select AVISTAMIENTO.id as idAvist, AVISTAMIENTO.latitude, AVISTAMIENTO.longitude, AVISTAMIENTO.idGrupoEspecie  from ESPECIE, AVISTAMIENTO where  ESPECIE.id=? and ESPECIE.id=AVISTAMIENTO.idEspecie and AVISTAMIENTO.borrado='no'";
    var query2 = "select count(*) as mg, AVISTAMIENTO.id from neguen_db.LIKE, AVISTAMIENTO where AVISTAMIENTO.idEspecie=? and LIKE.idPost=AVISTAMIENTO.id and LIKE.categoria='A' group by AVISTAMIENTO.id";

    connection.connection.query(query,[ req.body.id], function(error, result, fields){
       // var resultado = {avistamientos:result};
        if(error) throw error;
        return res.send(result);
    });
}
exports.listComentarios = function(req, res){
    var query2 = "select count(*) as mg, COMENTARIO_esp.id, USUARIO.email as email_like from neguen_db.LIKE, COMENTARIO_esp, USUARIO where USUARIO.id=LIKE.idUsuario and COMENTARIO_esp.idPost=? and LIKE.idPost=COMENTARIO_esp.id and LIKE.categoria='D' group by COMENTARIO_esp.id";
    connection.connection.query("select COMENTARIO_esp.id, USUARIO.id as idUsuario, nombre, email, idPost, COMENTARIO_esp.descripcion, COMENTARIO_esp.fecha_creac from COMENTARIO_esp, USUARIO WHERE COMENTARIO_esp.idUsuario=USUARIO.id and idPost=?  ORDER BY COMENTARIO_esp.id DESC", [req.body.id], function(err, row,fields){
        if(err) console.log(err);
      //  console.log("getuser: ", row);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 0});
       }
       else{
        var resultado = {likes:null, comentarios:row};
        connection.connection.query(query2,[req.body.id], function(error, resultLikes, fields){
            if(error) throw error;
            resultado.likes=resultLikes;
               res.send({
                       success:true,
                       'message': resultado
               });
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
            var data ={idUsuario: results[0].id,  idPost:req.body.idPost, descripcion: req.body.descripcion, borrado:'no'};
            console.log("data: ", data);
            connection.connection.query("insert into  COMENTARIO_esp  SET ?", data ,function(error, results2, fields){
                if(error) throw error;
            res.send({id: results[0].id, nombreUser:results[0].nombre, result: results2 });   
            });
        }
    });
}
exports.DeleteComentario = function(req,res){
   // console.log("delete: ", req.body);
        connection.connection.query("delete from  COMENTARIO_esp  where  id=?",[req.body.id ],function(error, results2, fields){
            if(error) throw error;
        res.send(JSON.stringify(results2));
        });
}