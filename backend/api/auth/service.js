var jwt = require('jwt-simple');
var moment = require('moment');
var config = require('../../config/auth.js');
exports.createToken = function(user) {
  var payload = {
    sub: user.email,
    iat: moment().unix(),
    exp: moment().add(100, "days").unix(),
  };
  return jwt.encode(payload, config.secret);
};