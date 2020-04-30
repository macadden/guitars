const { User } = require('./../models/user');

let auth = (req,res,next) => {
    let token = req.cookies.w_auth;

    User.findByToken(token,(err,user)=>{
        if(err) throw err;
        if(!user) return res.json({
            isAuth: false,
            error: true  //esto es de REACT; REDUX (?).
        });

        req.token = token; // si todo está bien mando una request con el token; (entro a "req" que recibo como parámetro y pusheo un token).
        req.user = user;
        next(); //Después de este "next()", paso a "server.js" luego del llamado a "auth" en "app.get()".
    })



}


module.exports = { auth }