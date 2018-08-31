var express = require('express');
var grupoespecie = require('../controllers/grupoEspecieController');
var usuario = require('../controllers/usersController');
var avistamiento = require('../controllers/avistamientosController');
var likes = require('../controllers/likesController');
var especie = require('../controllers/especieController');
var proyecto = require('../controllers/proyectoController');
var comentario = require('../controllers/comentariosController');
var seguir = require('../controllers/seguir.Controller');
var mail = require('../controllers/mailController');
var multer  = require('multer');
const ejwt = require('express-jwt');
const config = require('../../config/auth.js');
var middleware = require('../middleware/index');
//var upload = multer({ dest: 'public/images/' })
module.exports = (function () {
  
  var storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, '/home/ubuntu/neguen/public/images/temp')
    },
    filename: (req, file, cb) => {
      cb(null, file.originalname )//cb(null, file.fieldname + '-' + Date.now() + '.jpg' )
    }
});
var upload = multer({storage: storage});

  var api = express.Router();
  // todoList Routes

  api.get('/mailtest',function(req,res){
    res.sendfile('index.html');});
  api.get('/send', mail.send);
  api.get('/verify', mail.verify);
  api.get('/grupoespecies',  grupoespecie.list_all);
  api.post('/users/exist', usuario.user_exist );
  api.post('/users/groups', usuario.user_groups );
  api.post('/users/editgrupos', usuario.EditGrupos);
  api.post('/users/login_fb',usuario.loginFacebook );
  api.post('/users/create', [upload.single('image'),function(req, res, next) {
    //console.log(req) 
   // console.log(req.files) 
  next() } ] , usuario.create_user);
  api.post('/users/edit', [upload.single('image'),function(req, res, next) {
  //  console.log("files: ", req.files)
  next() } ] , usuario.EditUser);
  api.get('/users/list', usuario.list_all);
  api.get('/users/:email', usuario.GetName );
  api.post('/users/getuser',usuario.GetUser );
  api.post('/getuser/id', usuario.GetUserById);
  api.post('/users/delete_user', usuario.deleteUser);
  api.post('/users/reactivar', usuario.reactivar);
  api.post('/users/list_email_name', usuario.list_Correo_Nombre);
  api.post('/users/public_perfil', usuario.ConsultarPerfil);
  api.post('/users/perfildrawbar', usuario.PerfilDrawBar);
  api.post('/sessions/create', usuario.login_user);
  //api.use('/protected', middleware.ensureAuthenticated );
  api.post('/protected/remember', middleware.ensureAuthenticated, usuario.user_exist );
    //.get();
  //  .post(todoList.create_a_task);
  api.post('/grupoespecies/getgrupos', grupoespecie.Getgrupos );
  
  api.post('/avistamiento/create', [upload.single('image'),function(req, res, next) {
    //  console.log("files: ", req.files)
    next() } ] , avistamiento.avistamiento_create);
  api.post('/avistamiento/amenazas', avistamiento.avistamiento_amenaza);
  api.post('/avistamiento/getamenazalatlng', avistamiento.getAmenazaLatLng);
  api.post('/avistamiento/getamenazas', avistamiento.getAmenazas);
  api.post('/avistamiento/misamenazas', avistamiento.MisAmenazas);
  api.post('/avistamiento/misamenazaslikecoment', avistamiento.MisAmenazasLikeComents);
  api.post('/avistamiento/editmapear', avistamiento.edit_amenaza);
  api.post('/avistamiento/edittemp', avistamiento.editTemp);
  api.post('/avistamiento/editgrupos', avistamiento.editGrupos);
  api.post('/avistamiento/editubica', avistamiento.editUbica);
  api.post('/avistamiento/editamenaza', avistamiento.editAmenazas);
  api.post('/avistamiento/editespecie', avistamiento.editEspecie);
  api.post('/avistamiento/editfoto', [upload.single('image'),function(req, res, next) {
    next() }] , avistamiento.editfoto);
  api.post('/avistamiento/delete_avist', avistamiento.deleteAvist);
  api.post('/avistamiento/getlikes', avistamiento.getLikes);
  api.post('/avistamiento/avistamientoslikecomment', avistamiento.AvistLikeComents);

  api.post('/likes/insertlike', likes.insertLike);
  api.post('/likes/deletelike', likes.DeleteLike);

  api.post('/especie/getnombres', especie.getNombreEspecie);
  api.post('/especie/getespecies', especie.getEspecies);
  api.post('/especie/especie_exist', especie.especie_exist);
  api.post('/especie/create', [upload.single('image'),function(req, res, next) {
    //  console.log("files: ", req.files)
    next() } ] , especie.especie_create);
  api.post('/especie/insertubic', especie.insertUbic);
  api.post('/especie/editfoto', [upload.single('image'),function(req, res, next) {
    next() } ] , especie.editfoto);
  api.post('/especie/editgrupos', especie.editGrupos);
  api.post('/especie/list', especie.listComentarios);
  api.post('/especie/insertcomentario', especie.insertComentario);
  api.post('/especie/deletecomentario', especie.DeleteComentario);
  api.post('/especie/editdescripcion', especie.editDescripcion);
  api.post('/especie/showavist', especie.especieAvist);
  api.post('/especie/showavistmap', especie.especieAvistMap);
  api.post('/especie/misespecies', especie.MisEspeciesLike);
  api.post('/especie/editArea', especie.editArea);

  api.post('/proyecto/create', proyecto.proyecto_create);
  api.post('/proyecto/getproyecto', proyecto.ConsultarProyecto);
  api.post('/proyecto/list', proyecto.listProyecto);
  api.post('/proyecto/getproyectoequipo', proyecto.getProyectoEquipo);
  api.post('/proyecto/editobjetivos', proyecto.editObjetivos);
  api.post('/proyecto/editnombre', proyecto.editNombre);
  api.post('/proyecto/editgrupo', proyecto.editGrupos);
  api.post('/proyecto/editespecies', proyecto.editEspecies);
  api.post('/proyecto/editequipo', proyecto.editEquipo);
  api.post('/proyecto/proyectoAvist', proyecto.proyectoAvist);
  api.post('/proeycto/proyectoAvistMap', proyecto.proyectoAvistMap);
  api.post('/proyecto/excel', proyecto.excel);
  api.post('/proyecto/editArea', proyecto.editArea);
  api.post('/proyecto/getproyectos', proyecto.GetProyectos);

  api.post('/comentario/list', comentario.listComentarios);
  api.post('/comentario/insertcomentario', comentario.insertComentario);
  api.post('/comentario/deletecomentario', comentario.DeleteComentario);

  api.post('/seguir/follow', seguir.Follow);
  api.post('/seguir/unfollow', seguir.Unfollow);

  api.post('/mail/enviarCalif', mail.enviarCalificacion);

 return api;
})();