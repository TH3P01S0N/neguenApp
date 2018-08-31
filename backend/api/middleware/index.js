var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../../config/auth');

exports.ensureAuthenticated = function(req, res, next) {
    console.log(req.body);

  if(!req.headers.authorization) {
    return res
      .status(403)
      .send({'success': false,message: "Tu petición no tiene cabecera de autorización"});
  }
  
  var token = req.headers.authorization.split(" ")[1];
  try {
    var payload = jwt.decode(token, config.secret);
    console.log("jwt decode: ", payload);
  }
  catch (err) {
    return res
    .status(403)
    .send({'success': false, message: "Mal token"});
  }
  if(payload.exp <= moment().unix()) {
     return res
     	.status(401)
        .send({'success': false,message: "El token ha expirado"});
  }
  
  req.user = payload.sub;
  console.log("user: ", req.user);
  next();
}
