'use strict';
var mysql = require('mysql');
var bcrypt = require('bcrypt');
const _ = require('lodash');
var fs = require('fs');
var moment = require('moment');
var request = require('request');
var mails = require("./mailController");
var connection = require("../../config/db");
const config = require('../../config/auth.js');
const jwt = require('jsonwebtoken');
var service = require('../auth/service');
function createIdToken(user){
	return jwt.sign(_.omit(user, 'password'), config.secret, {expiresIn: 60*60*5});
}
function createAccessToken() {
  return jwt.sign({
    iss: config.issuer,
    aud: config.audience,
    exp: Math.floor(Date.now() / 1000) + (60 * 60),
    scope: 'full_access',
    sub: "lalaland|gonto",
    jti: genJti(), // unique identifier for the token
    alg: 'HS256'
  }, config.secret);
}
// Generate Unique Identifier for the access token
function genJti() {
  let jti = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  for (let i = 0; i < 16; i++) {
      jti += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  
  return jti;
}
var download = function(uri, filename, callback){
    request.head(uri, function(err, res, body){
      console.log('content-type:', res.headers['content-type']);
      console.log('content-length:', res.headers['content-length']);
  
      request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
    });
  };
function createFolder(path, cb) {
    fs.mkdir(path,  function(err) {
        if (err) {
            if (err.code == 'EEXIST') cb(null); // ignore the error if the folder already exists
            else cb(err); // something else went wrong
        } else cb(null); // successfully created folder
    });
}
function updateBorrado(borrado, email){
    connection.connection.query("UPDATE  USUARIO SET borrado=? where email=?", [borrado, email ], function(error, results, fields){
        if(error) throw error;
          });
}
exports.list_all = function(req, res) {
    connection.connection.query("select * from USUARIO", function(error, results, fields){
        if(error) throw error;
       res.send(JSON.stringify(results));
 
       });
};
exports.list_Correo_Nombre = function(req, res) {
    connection.connection.query("select id, nombre, email from USUARIO where borrado='no'", function(error, results, fields){
        if(error) throw error;
        res.send(JSON.stringify(results));
       });
};
exports.user_exist = function(req, res) {
    var email = " ";
    if(!req.body.email){
        if(!req.user){
            return res.send({'success': false, 'message': 'Ya existe un usuario con ese correo'});
        }
        else{
            email=req.user;
        }
    }
    else{
        email=req.body.email;
    }
    connection.connection.query("SELECT id, borrado, facebook, verificado FROM USUARIO WHERE email = ? ", email,function(error, results, fields ){
        if(error) throw error;
         //   console.log(results);
       if(results.length > 0){
            if(results[0].facebook!='no')
                return res.send({'success': false, 'message': 'facebook', 'verificado': results[0].verificado});
           if(results[0].borrado=='si')
             return res.send({'success': false, 'message': 'reactivar'});
           else
                return res.send({'success': false, 'message': 'Ya existe un usuario con ese correo','verificado': results[0].verificado});
         }
         else {          
            return res.send({'success': true, 'message': 'No existe un usuario con ese correo'});  
         }
       });
};

function insertGrupos(records){
    var sql = "INSERT INTO GRUPO_ESPECIE_detalle_usr (idUsuario, idGrupoEspecie)  VALUES ?";
   // console.log("records: ", records);
    connection.connection.query(sql, [records] ,function(error, results, fields ){
        if(error) throw error;         
            return true;  
       });
}
function select_grupos (email, grupos){
    var records = [];
    var id = null;
    connection.connection.query("SELECT id FROM USUARIO WHERE email = ?", email,function(error, results, fields ){
        id=results[0].id;
        console.log("id: ", id);
        for (var i = 0, len = grupos.length; i < len; i++) {
            records.push([id, grupos[i] ]);
        } 
       // console.log("length: ", records.length);
        if(records.length>0){
          insertGrupos(records);
            return true;              
        }
        else return false;
    });  
}
exports.user_groups = function(req, res) {
    var grupos = req.body.groups;
    var records = [];
    var id = null;
    if (grupos.length > 0){
        select_grupos(req.body.email,grupos);
        return res.send({'success': true, 'message': 'Usuario creado!'});
       // else return res.send({'success': false, 'message': 'error en grupo'});
    }
      /*  connection.connection.query("SELECT id FROM USUARIO WHERE email = ?", req.body.email,function(error, results, fields ){
            id=results[0].id;
            console.log("id: ", id);
            for (var i = 0, len = grupos.length; i < len; i++) {
                records.push([id, grupos[i] ]);
            }           
            if(records.length>0){
              insertGrupos(records);
             // fs.unlink(source, (err) => {
              //  if (err) throw err;
             // });
            return res.send({'success': true, 'message': 'Usuario creado!'});              
            }
        });    
    }
    else{
        return res.send({'success': false, 'message': 'error en grupo'});
    }   */
};

exports.create_user = function(req, res) {
    var fb = "no";
    var fecha_nac = req.body.fecha_nac;
    var password = req.body.password;
    let passwordHash = bcrypt.hashSync(req.body.password, 12);
    if(password=='facebook'){
        fb=req.body.facebook;
        var date= moment(req.body.fecha_nac, "MM/DD/YYYY")
        fecha_nac= date.format("DD/MM/YYYY")
    }
    let newUser = {
        nombre: req.body.nombre,
        email: req.body.email,
        password : passwordHash,
        fecha_nac: fecha_nac,
        descripcion: req.body.descripcion,
        categoria: 'usuario',
        localidad: req.body.localidad,
        genero: req.body.genero,
        verificado: 'no',
        foto: req.body.foto,
        facebook: fb,
        borrado: 'no'
    } ; 
    var path = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email;
            createFolder(path, function(err) {
                if (err) throw err; // handle folder creation error
                //else // we're all good
           });
    var source = "/home/ubuntu/neguen/public/images/temp/" + req.body.email + '.jpg';
    var dest = path + '/' + req.body.email + '.jpg' ;
    if (newUser.foto != '/'){
        if(newUser.foto=='foto'){
            fs.rename(source, dest, (err) => {
                if (err) throw err;
            // console.log("destino: ", dest);
            }); 
            newUser.foto = dest; 
        }
        else{
            var path_fb = path + "/" + req.body.email + '.jpg';
            download(newUser.foto, path_fb, function(){
                console.log("path_fb: ", path_fb);
              });
              newUser.foto = path_fb; 
        }
    }   
    else {
        newUser.foto = '/';
    }
    //res.send({'success': false, 'message': 'se subio la foto'});
    var token = service.createToken(newUser);
    newUser.access_token = token;
   // console.log("newUser: ", newUser);
    connection.connection.query("SELECT id FROM USUARIO WHERE email = ? ", req.body.email,function(error, results, fields ){
        if(error) throw error;
        if(results.length > 0){
            return res.send({'success': false, 'message': 'Ya existe un usuario con ese correo'});
        }
        else{
            connection.connection.query("INSERT INTO USUARIO SET ?", newUser, function(error, results, fields){
                if(error) throw error;         
                    mails.enviar(token, newUser.email);
                    res.send({
                        success:true,
                        message: "crear usuario",
                        id_token: token //createIdToken(newUser),                        
                        //access_token: createAccessToken()
                    });
         
               });
        }
    });

      
};
exports.login_user = function(req, res) {
    var username = req.body.username;
     var password = req.body.password;
  let newUser = _.pick(req.body, 'username');
   newUser.password = req.body.password;
  connection.connection.query("SELECT password, borrado, verificado FROM USUARIO WHERE email = ? ", [username], function(err, row,fields){
         if(err) console.log(err);
         if(row.length < 1 || row[0].borrado=='si' ){
                //res.send({'success': true, 'message': row[0].username});
                return res.send({'success': false, 'message': 'Datos incorrectos'});
        }
        else{
            var passwordIsvalid = bcrypt.compareSync(password, row[0].password);
            if (!passwordIsvalid)  {res.send({'success': false, 'message': 'Contraseña no coincide'});}
            else{
                res.send({
                        success:true,
                        id_token: service.createToken(newUser), //createIdToken(newUser),
                        verificado: row[0].verificado
                      //  access_token: createAccessToken()
                });
            }
            }
        });
};

exports.loginFacebook = function(req, res) {
    var username = req.body.username;
    var facebook = req.body.facebook;
    let newUser = {
        email: username
    };
   newUser.password = req.body.password;
    connection.connection.query("SELECT facebook, borrado, verificado FROM USUARIO WHERE email = ?", [username], function(err, row,fields){
        if(err) console.log(err);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 'Datos incorrectos'});
       }
       else{
            if(row[0].borrado=='si')
                return res.send({'success': false, 'message': 'reactivar'});
            if(row[0].facebook==facebook){
                res.send({
                    success:true,
                    id_token: service.createToken(newUser), //createIdToken(newUser),
                    verificado: row[0].verificado
                   // access_token: createAccessToken()
            });
            }
           else{
               res.send({
                       success:false,
                       'message': 'Error al entrar con facebook'
               });
           }
           }
       });
};

exports.GetName = function(req, res) {
    var email = req.params.email;
    if(!email){
        email= "-";
    }
    connection.connection.query("SELECT nombre FROM USUARIO WHERE email = ?", [email], function(err, row,fields){
        if(err) console.log(err);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 'Nombre'});
       }
       else{
               res.send({
                       success:true,
                       'message': row[0].nombre
               });
           }
       });
}

exports.GetUser = function(req, res) {
    var email = req.body.email;
    if(!email){
        email= "-";
    }
    connection.connection.query("SELECT nombre, fecha_nac,localidad, genero, foto, descripcion, facebook FROM USUARIO WHERE email = ?", [email], function(err, row,fields){
        if(err) console.log(err);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 'Hubo un problema'});
       }
       else{
               res.send({
                       success:true,
                       'message': row[0]
               });
           }
       });
}
exports.GetUserById = function(req,res){
    var id = req.body.id;
    console.log("body: ", req.body);
    connection.connection.query("SELECT nombre, email FROM USUARIO WHERE id = ?", [id], function(err, row,fields){
        if(err) console.log(err);
      //  console.log("getuser: ", row);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 'Nombre'});
       }
       else{
               res.send({
                       success:true,
                       'message': row[0]
               });
           }
       });
}
exports.ConsultarPerfil = function(req,res){
    var id = req.body.id;
    var email = req.body.email; //usuario que esta viendo
    console.log("body: ", req.body);
    var resultado={nombre:"", email:"", descripcion:"", ifSeguido:"", seguidos:0, seguidores:0}
    connection.connection.query("SELECT nombre, email, descripcion FROM USUARIO WHERE id = ?", [id], function(err, row,fields){
        if(err) console.log(err);
      //  console.log("getuser: ", row);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 'Nombre'});
       }
       else{
        connection.connection.query("SELECT count(SEGUIR.id) as ifFollow FROM  SEGUIR,USUARIO WHERE SEGUIR.idUsuario=USUARIO.id and email = ? and SEGUIR.idUsuarioSeg=?", [email,id], function(err, result,fields){
            if(err) console.log(err);
            connection.connection.query("SELECT  A.seguidores, B.seguidos FROM (select count(*) as seguidores, idUsuarioSeg from SEGUIR where idUsuarioSeg=?) as A, (select count(*) as seguidos, idUsuario from SEGUIR where idUsuario=?) as B", [id,id], function(err, result_seguidores,fields){           
                if(err) console.log(err);
                resultado.nombre=row[0].nombre;
                resultado.email=row[0].email;
                resultado.descripcion=row[0].descripcion;
                resultado.seguidores=result_seguidores[0].seguidores;
                resultado.seguidos=result_seguidores[0].seguidos;
                resultado.ifSeguido=result[0].ifFollow;
                res.send({
                        success:true,
                        'message': resultado
                });
                });
            });
           }
       });
}
exports.PerfilDrawBar = function(req,res){
    var email = req.body.email; //correo usuario
    console.log("body: ", req.body);
    var resultado={nombre:"", email:"", descripcion:"",  seguidos:0, seguidores:0}
    connection.connection.query("SELECT id,nombre, descripcion FROM USUARIO WHERE email = ?", [email], function(err, row,fields){
        if(err) console.log(err);
      //  console.log("getuser: ", row);
        if(row.length < 1){
               //res.send({'success': true, 'message': row[0].username});
               return res.send({'success': false, 'message': 'Nombre'});
       }
       else{
            connection.connection.query("SELECT  A.seguidores, B.seguidos FROM (select count(*) as seguidores, idUsuarioSeg from SEGUIR where idUsuarioSeg=?) as A, (select count(*) as seguidos, idUsuario from SEGUIR where idUsuario=?) as B", [row[0].id,row[0].id], function(err, result_seguidores,fields){           
                if(err) console.log(err);
                resultado.nombre=row[0].nombre;
                resultado.email=email;
                resultado.descripcion=row[0].descripcion;
                resultado.seguidores=result_seguidores[0].seguidores;
                resultado.seguidos=result_seguidores[0].seguidos;
                res.send({
                        success:true,
                        'message': resultado
                });
                });
           }
       });
}
exports.EditUser = function(req, res){
    var password = req.body.password;
    let passwordHash = bcrypt.hashSync(req.body.password, 12);
    let newUser = {
        nombre: req.body.nombre,
        password : passwordHash,
        fecha_nac: req.body.fecha_nac,
        descripcion: req.body.descripcion,
        genero: req.body.genero,
        foto: req.body.foto,
        localidad: req.body.localidad
    } ;
   // console.log("newuser: ", newUser);
    var path = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email;
            createFolder(path, function(err) {
                if (err) throw err; // handle folder creation error
               // else console.log("mkdir "); // we're all good
           });
    var source = "/home/ubuntu/neguen/public/images/temp/" + req.body.email + '.jpg';
    var dest = path + '/' + req.body.email + '.jpg' ;
    if (newUser.foto != '/'){
            fs.rename(source, dest, (err) => {
                if (err) throw err;
             //console.log("destino: ", dest);
            }); 
            newUser.foto = dest; 
           // console.log("newUser: ", newUser);
            connection.connection.query("UPDATE  USUARIO SET nombre=?, fecha_nac=?, password=?, genero=?, descripcion=?, foto=?, localidad=? where email=?", [newUser.nombre, newUser.fecha_nac, newUser.password, newUser.genero,newUser.descripcion, newUser.foto, newUser.localidad, req.body.email ], function(error, results, fields){
             if(error) throw error;
                res.send({
                success:true,
                message: "actualizar usuario",
                });
         
               });
    }   
    else {
       // console.log("newUser: ", newUser);
        connection.connection.query("UPDATE  USUARIO SET nombre=?, fecha_nac=?, password=?, genero=?, descripcion=?, localidad=? where email=? ", [newUser.nombre, newUser.fecha_nac, newUser.password, newUser.genero,newUser.descripcion,newUser.localidad,   req.body.email], function(error, results, fields){
        if(error) throw error;
            res.send({
                success:true,
                message: "actualizar usuario",
                });
         
               });
    }    
}
exports.EditGrupos = function (req, res){
    var grupos = req.body.groups;
    connection.connection.query("SELECT id FROM USUARIO WHERE email = ? ", req.body.email,function(error, results, fields ){
        if(error) throw error;
        if(results.length < 0){
            return res.send({'success': false, 'message': 'Hubo un problema'});
        }
        else{
            connection.connection.query("DELETE from GRUPO_ESPECIE_detalle_usr  where idUsuario=?", results[0].id  , function(error, results, fields){
                if(error) throw error;
                if(grupos){
                select_grupos(req.body.email,grupos);}
                 return res.send({'success': true, 'message': 'Usuario actualizado!'});
               // else {return res.send({'success': false, 'message': 'error en grupo'}); }       
               });
        }
    }); 
}
exports.deleteUser = function (req, res){
    console.log("body: ", req.body);
    var path = "/home/ubuntu/neguen/deletes/"+ req.body.email;
    var source = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email + '/' + req.body.email + '.jpg' ; 
    if (fs.existsSync(source)){ 
        createFolder(path, function(err) {
            if (err) throw err; // handle folder creation error
        // else console.log("mkdir "); // we're all good
        });
        var dest = path  + '/' + req.body.email + '.jpg';     
        fs.rename(source, dest, (err) => {
            if (err) throw err;
        }); 
    }
    updateBorrado('si', req.body.email);
    //BORRAR TAMBIEN LOS AVIST
    return res.send({'success': true, 'message': 'Usuario actualizado!'});
}
exports.reactivar = function (req, res){
    var path = "/home/ubuntu/neguen/deletes/"+ req.body.email + '/' + req.body.email + '.jpg' ;
    var source = "/home/ubuntu/neguen/public/images/uploads/"+ req.body.email ; 
    if (fs.existsSync(path)){ 
        createFolder(source, function(err) {
            if (err) throw err; // handle folder creation error
        // else console.log("mkdir "); // we're all good
        });
        var dest = source  + '/' + req.body.email + '.jpg';     
        fs.rename(path, dest, (err) => {
            if (err) throw err;
        }); 
    }
    updateBorrado('no', req.body.email);
    //BORRAR TAMBIEN LOS AVIST
    return res.send({'success': true, 'message': 'Usuario actualizado!'});
}