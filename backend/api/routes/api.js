var express = require('express');
var router = express.Router();
var mysql = require('mysql');

var bcrypt = require('bcrypt');
const _ = require('lodash');
//const auth = require('../auth');
const jwt = require('jsonwebtoken');
const ejwt = require('express-jwt');
const config = require('../config/auth.js');

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
// Validate access_token
var jwtCheck = ejwt({
    secret: config.secret,
    audience: config.audience,
    issuer: config.issuer
  });
  
  // Check for scope
  function requireScope(scope) {
    return function (req, res, next) {
      console.log("req ", req);
      var has_scopes = req.user.scope === scope;
      if (!has_scopes) { 
          res.send({'success': false, 'message': 'Scope error'});
          return;
      }
      next();
    };
  }
  
var connection = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: 'toor',
	database: 'neguen_db',
	socketPath: '/opt/lampp/var/mysql/mysql.sock',
});

router.get('/read', function(req, res, next) {
    connection.query("select * from GRUPO_ESPECIE", function(error, results, fields){
       if(error) throw error;
           console.log(results);
      res.send(JSON.stringify(results));

      });
      //res.send("respond");
  });

  module.exports = router;