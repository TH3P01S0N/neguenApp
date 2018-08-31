var mysql = require('mysql');
var connection = require("../../config/db");
var nodemailer = require("nodemailer");
var connection = require("../../config/db");
var smtpTransport = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: "proyectoneguen@gmail.com",
        pass: "Neguen2018"
    }
});
var rand,mailOptions,host,link;
exports.send = function(req, res){
    rand=Math.floor((Math.random() * 100) + 54);
    host=req.get('host');
    link="http://"+req.get('host')+"/api/verify?id="+rand;
    mailOptions={
        to : req.query.to,
        subject : "Please confirm your Email account",
        html : "Hello,<br> Please Click on the link to verify your email.<br><a href="+link+">Click here to verify</a>" 
    }
    //console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: " + response.message);
        res.end("sent");
         }
    });
}

exports.verify = function(req, res){
    var token = "";
    var email=req.query.email;
    connection.connection.query("SELECT access_token FROM USUARIO WHERE email = ? and verificado=?", [email, 'no'],function(error, results, fields ){
        if(error) throw error;
        if(results.length>0){
            token = results[0].access_token;
            var host = "ec2-18-236-189-40.us-west-2.compute.amazonaws.com";
            console.log(req.protocol+":/"+req.get('host'));
            if((req.protocol+"://"+req.get('host'))==("http://"+host))
            {
                //console.log("Domain is matched. Information is from Authentic email");
                //console.log("id: ", req.query.id);
                //console.log("token: ", token);
                if(req.query.id==token)
                {
                    console.log("email is verified");
                    connection.connection.query("UPDATE  USUARIO SET verificado=? where email=?", ['si', email], function(error, results, fields){
                        if(error) throw error;
                    });
                    res.end("<h1>Tu correo "+email+" ha sido verificado, bienvenid@ a Neguen.");
                }
                else
                {
                    console.log("email is not verified");
                    res.end("<h1>Bad Request</h1>");
                }
            }
            else
            {
                res.end("<h1>Request is from unknown source");
            }
        }
        else{
            res.end("<h1>Este correo ya fue confirmado, ya puedes compartir registros en Neguen.");
        }
    });
    
}

exports.enviar = function(token, email){
    link = "http://ec2-18-236-189-40.us-west-2.compute.amazonaws.com/api/verify?id="+token+"&email="+email; 
    console.log("link: ", link);
    console.log("email: ", email);
    mailOptions={
        to : email,
        subject : "Por favor confirma tu correo",
        html : "Hola,<br> Por favor, confirma tu correo en el siguiente link.<br><a href="+link+">Click aquí para verificar</a>" 
    }
   // console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: ");
        res.end("sent");
         }
    });
}
exports.enviarCalificacion = function(req, res){

    mailOptions={
        to : "proyectoneguen@gmail.com",
        subject : "Nueva calificación",
        html : req.body.nombre+ " a calificado Neguén con "+req.body.calificacion+"." 
    }
   // console.log(mailOptions);
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
        res.end("error");
     }else{
            console.log("Message sent: ");
        //res.end("sent");
        res.send({
            success:true,
            message: "mail enviado",
            });
         }
    });
}
exports.enviar_excel = function(excel, email, nombre, nombreProy){

    console.log("email: ", email);
    mailOptions={
        to : email,
        subject : " NEGUÉN | "+ nombreProy,
        html : "Hola,<br> te adjunto planilla en excel de tu proyecto<br>" ,
        attachments: [{
            filename: nombre,
            content: new Buffer.from(excel, 'utf-8')
        }]
    }
   console.log(mailOptions);
   
    smtpTransport.sendMail(mailOptions, function(error, response){
     if(error){
            console.log(error);
       // res.end("error");
     }else{
            console.log("Message sent: ");
       // res.end("sent");
         }
    });
}