const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const SALT_I = 10; //Cuando se encripta algo, hay que usar un "salt"
const jwt = require('jsonwebtoken'); //para generar el token nuevo dsp de checkear la pass.
require('dotenv').config(); //para hacer uso de los procesos (?) de "dotenv" ¿Para "SECRET" del archivo ".env"?

const userSchema = mongoose.Schema({
    email: {
        type: String,
        require: true,
        trim: true,
        unique: 1
    },
    password: {
        type: String,
        require: true,
        minlength: 5
    },
    name: {
        type: String,
        require: true,
        maxlength: 100
    },
    lastname: {
        type: String,
        require: true,
        maxlength: 100
    },
    cart: {
        type: Array,
        default: []
    },
    history: {
        type: Array,
        default: []
    },
    role: {
        type: Number,
        default: 0
    },
    token: {
        type: String
    }
});

/**-"pre()" sirve para hacer algo ANTES de lo que queramos hacer. Entonces, antes de ir a "user.save" en "server.js", hago "pre('save')"; y
 * luego corro una función.
 * -Busco encriptar la password.
*/
userSchema.pre('save', function (next) {
    var user = this; //user = userSchema

    if (user.isModified('password')) { //"isModified()" es de MONGO; veo si el usuario está tratando de modificar la password o no.
        bcrypt.genSalt(SALT_I, function (err, salt) {
            if (err) return next(err) //"next" mata lo que estoy haciendo acá y se mueve al paso siguiente.

            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) return next(err);  //"next" mata lo que estoy haciendo acá y se mueve al paso siguiente.
                user.password = hash;
                next();
            });
        })
    } else {
        next()
    }

})

/**-Método para comparar contraseñas
 * -cb = callback function.
 * -
*/
userSchema.methods.comparePassword = function(candidatePassword,cb){
    bcrypt.compare(candidatePassword,this.password,function(err,isMatch){
        if(err) return cb(err);
        cb(null,isMatch)
    })
}

userSchema.methods.generateToken = function(cb){
    var user = this;
    var token = jwt.sign(user._id.toHexString(),process.env.SECRET) /**-"theHexString" es un método que transforma la pass en un string
                                                                       - "_id" es porque MongoDB tiene "id" con "_". 
                                                                       - */
    user.token = token;
    user.save(function(err,user){
        if(err) return cb(err);
        cb(null,user);
    })
}

/**- "statics" es un método; cb = callback function.
 * - "jwt" para verificar si el token está bien.
 * - 
 */
userSchema.statics.findByToken = function(token,cb){
    var user = this;

    jwt.verify(token,process.env.SECRET,function(err,decode){
        user.findOne({"_id":decode,"token":token},function(err,user){
            if(err) return cb(err);
            cb(null,user);
        })
    })
}

const User = mongoose.model('User', userSchema);

module.exports = { User }