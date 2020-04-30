/**Creo una App Express */

const express = require('express');
const bodyParser = require('body-parser'); //Lo uso cuando tengo una request con Json.
const cookieParser = require('cookie-parser');
const formidable = require('express-formidable');//Cuando se tienen request que tienen archivos dentro.
const cloudinary = require('cloudinary');

const app = express();
const mongoose = require('mongoose');
//const async = require('async'); //De "NodeJS"; es para hacer una sola "callback" dsp de varias iteraciones (además sé cuándo estas terminan)
require('dotenv').config(); //Con "dotenv" es la manera de usar ".env"; puedo usar "process.env.DATABASE" y no necesito usar el process.env.PORT || 3002

mongoose.Promise = global.Promise
mongoose.connect(process.env.DATABASE)

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

cloudinary.config({ //Estas 3 van a estar almacenadas en el ambiente de NODE (en las variables de ambiente) => las establezco en ".env"
    cloud_name: process.env.CLOUD_NAME,
    api_key:process.env.CLOUD_API_KEY,
    api_secret:process.env.CLOUD_API_SECRET
})

//Models
const { User } = require('./models/user');
const { Brand } = require('./models/brand');
const { Wood } = require('./models/wood');
const { Product } = require('./models/product');
const { Payment } = require('./models/payment');
const { Site } = require('./models/site');

//Middlewares
const { auth } = require('./middleware/auth');
const { admin } = require('./middleware/admin');


//=====================================================================================================================================
//                          PRODUCTS ROUTES
//=====================================================================================================================================

/**-RUTA PÚBLICA.
 * -"post" porque estoy a la "escucha" de un "json data".
 * -Acá paso cosas a MONGO. 
 */
app.post('/api/product/shop',(req,res)=>{

    let order = req.body.order ? req.body.order : "desc"; //Uso "body" y no "query" porque uso "json data". Si ya tengo un orden digo que se mantenga, sino lo tengo, que sea descendente.
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100; //El "parseInt()" es porque "limit" y "skip" en MONGOOSE necesitan ser un nro.
    let skip = parseInt(req.body.skip);
    let findArgs = {}; //Igual a un objeto vacío.

    for(let key in req.body.filters){ //loopeo los 4 filtros.
        if(req.body.filters[key].length >0){ //Si el filtro NO es vacío, hago algo.
            if(key === 'price'){
                findArgs[key] = { //va a ser igual a un OBJETO, así que lo tengo que pasar.
                   //Esta es la manera de decirle a MONGO que, dentro de un objeto, busque valor más grande (lte) y mas chico (gte: grather and equal).
                    $gte: req.body.filters[key][0], //a la derecha del ":" está "lo más grande que..." ///Paso la 1ra posición del array, el punto inicial.
                    Slte: req.body.filters[key][1] //Paso "1" porque necesito la 2da posición, ya que el array era de dos posiciones.
                }
            } else { //Por default, si no hay "price".
                findArgs[key] = req.body.filters[key]
            }
        }
    }

    findArgs['publish'] = true; //Muestro solo las "publish = true" => Oculto la info y la imagen de las guitarras que son "publish = false".

    //referencia al "MODEL" Product.
    Product.
    find(findArgs).
    populate('brand'). //Esto lo hago porque una vez que tengo los resultados de "find()", tengo que cambiar los ID de BRAND y WOOD.
    populate('wood').
    sort([[sortBy,order]]). //"Sort" = ordenar.
    skip(skip).
    limit(limit).
    exec((err,articles)=>{ //A partir de acá para obtener la info, la data.
        if(err) return res.status(400).send(err);
        res.status(200).json({ //El json espera un "article" y un "size"; entonces el REDUCER va a recibir esto como una rta.
            size: articles.length,
            articles
        })
    })
})

//Los traigo vía ARRIVAL
//   /articles?sortBy=createdAt&order=desc&limit=4

// Los traigo vía SELL
//   /articles?sortBy=sold&order=desc&limit=100
app.get('/api/product/articles',(req,res)=>{
    
    let order = req.query.order ? req.query.order : 'asc'; //Si tengo "order" entonces va a ser igual a lo que tengo, si no lo tengo (entra a "?") igual a ascendente
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 100; //con "parseInt" ¿¿¿paso a intiger???
    
    Product.
    find().
    populate('brand').
    populate('wood').
    sort([[sortBy,order]]).
    limit(limit).
    exec((err,articles)=>{
        if(err) return res.status(400).send(err);
        res.send(articles)
    })

})




/**-Traigo productos por ID.
 * - Voy a usar "Query Strings"; EJ: /api/product/article?id=TYDHETGVSR&type=erthgdtgbd.  ==> Una URL, seguida de un "?", luego un atributo (id),
 *  divido con "&" y después el type.
 * -"Query" lo puedo usar por: "bodyParser.urlencoded({ extended: true })".
 * - 
 */
app.get('/api/product/articles_by_id', (req, res) => {
    let type = req.query.type;
    let items = req.query.id;

    if (type === "array") {
        let ids = req.query.id.split(',');
        items = [];
        items = ids.map(item => {
            //Convertir las ids, de formato array, a un objeto id de mongoose y luego meterla en el array items.
            return mongoose.Types.ObjectId(item)
        })
    }

    /**-Busco un producto (OJO: "P"roduct) por un solo item o por una ID. Luego ejecuto lo que quiera ejecutar y mando de vuelta a "docs".
     * -"$in:items". Lo uso así porque puede buscar uno o más items (un sólo valor o un array).
     * -"populate()" sirve para especificar en qué campo de Product quiero traer (?). Quiero devolver "ref" de estos campos porque no puedo
     *  mostrar en pantalla una id en lugar del nombre; necesito mostrar el nombre.
    */
    Product.
        find({ '_id': { $in: items } }).
        populate('brand').
        populate('wood').
        exec((err, docs) => {
            return res.status(200).send(docs)
        })
});



app.post('/api/product/article', auth, admin, (req, res) => {
    const product = new Product(req.body);

    product.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            article: doc
        })
    })
})


//=====================================================================================================================================
//                          WOODS ROUTES
//=====================================================================================================================================

app.post('/api/product/wood', auth, admin, (req, res) => {

    const wood = new Wood(req.body);

    wood.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            wood: doc
        })
    })
});

/**-OJO: es woodS; OJO: es Wood; 
   -OJO: pongo 'find({})' porque quiero buscar TODO. Esto porque el único lugar de donde voy a traer todas las listas de 'woods' es
     cuando meto un nuevo producto.*/
app.get('/api/product/woods',(req,res)=>{ 
    Wood.find({},(err,woods)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(woods)
    })
}) 


//=====================================================================================================================================
//                          BRAND ROUTES
//=====================================================================================================================================

app.post('/api/product/brand', auth, (req, res) => {
    const brand = new Brand(req.body);

    brand.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({
            success: true,
            brand: doc
        })
    })
})

app.get('/api/product/brands', (req, res) => {
    Brand.find({}, (err, brands) => {
        if (err) return res.status(400).send(err);
        res.status(200).send(brands)
    })
})



//=====================================================================================================================================
//                          USERS ROUTES
//=====================================================================================================================================




/**- Uso "get" porque no mando verdaderamente información, solo paso las cookies con el "auth" (las cookies están en "req" o request).
 * - Se obtiene una request de la 'api/users/auth', luego va a "auth" (que es un MIDDLEWARE), este va a hacer algo y recibe "req,res". Si en "auth.js" pasa
 * a "next" => acá pasa a la siguiente acción (la callback function). Si algo sale mal en "auth.js", en vez de esto se manda un msj de error o algo así.
 * - En el "req" traigo la data del usuario y el token posta.
*/
app.get('/api/users/auth', auth, (req, res) => {
    res.status(200).json({
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        cart: req.user.cart,
        history: req.user.history
    })




})

app.post('/api/users/register', (req, res) => {
    const user = new User(req.body); //creo un nuevo "model" (user) y espero datos del "body" en la request.

    //creo un nuevo usuario y lo guardo en la base de datos (MongoDB).
    user.save((err, doc) => {
        if (err) return res.json({ success: false, err });
        res.status(200).json({  //"res" es "response".
            success: true,
            //userdata: doc  ---> si dejara esta linea, mandaria toda la data del usuario.. pero no quiero hacer eso.

        })
    })


});

/** -POST porque tienen que mandar el user y la pass. */
app.post('/api/users/login', (req, res) => {

    // find the email (método)
    User.findOne({ 'email': req.body.email }, (err, user) => {
        if (!user) return res.json({ loginSuccess: false, message: 'Auth failed, email not found' });

        // check password (método)
        user.comparePassword(req.body.password, (err, isMatch) => {
            if (!isMatch) return res.json({ loginSuccess: false, message: 'Wrong password' });

            // generate a token (método)
            user.generateToken((err, user) => {
                if (err) return res.status(400).send(err);
                res.cookie('w_auth', user.token).status(200).json({
                    loginSuccess: true
                })
            })
        })
    })
})

app.get('/api/users/logout', auth, (req, res) => {

    User.findOneAndUpdate(
        { _id: req.user._id },
        { token: '' },
        (err, doc) => {
            if (err) return res.json({ success: false, err });
            return res.status(200).send({
                success: true
            })
        }
    )

});


app.post('/api/users/uploadimage', auth, admin, formidable(), (req, res) => { /**Para hacer un upload con cloudinary necesito mandar 3 argumentos: Lo que 
                                                                   necesito pasar, el callback y un objeto con la configuración. */
    cloudinary.uploader.upload(req.files.file.path, (result) => {
        console.log(result);
        res.status(200).send({
            public_id: result.public_id,
            url: result.url
        })

    }, { //hay muchas más opciones de configuración.
        public_id: `${Date.now()}`,
        resource_type: 'auto' //el tipo de archivo que subo. Si no se cual es o no me importa, mando "auto".
    })
})

app.get('/api/users/removeimage', auth, admin, (req, res) => {
    let image_id = req.query.public_id;

    cloudinary.uploader.destroy(image_id, (error, result) => {
        if (error) return res.json({ success: false, error });
        res.status(200).send('ok');
    })

})



app.post('/api/users/addToCart', auth, (req, res) => {

    User.findOne({ _id: req.user._id }, (err, doc) => {
        let duplicate = false;

        doc.cart.forEach((item) => {
            if (item.id == req.query.productId) {
                duplicate = true;
            }
        })

        if (duplicate) {
            User.findOneAndUpdate(
                { _id: req.user._id, "cart.id": mongoose.Types.ObjectId(req.query.productId) },
                { $inc: { "cart.$.quantity": 1 } }, /**-"$inc" es algo de MONGOOSE. */
                { new: true }, // Devuelve todos los elementos de "cart" que están dentro del usuario.
                () => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(doc.cart)
                }
            )



        } else {
            User.findOneAndUpdate(
                { _id: req.user._id },
                {
                    $push: {
                        cart: {
                            id: mongoose.Types.ObjectId(req.query.productId),
                            quantity: 1,
                            date: Date.now()
                        }
                    }
                },
                { new: true },
                (err, doc) => {
                    if (err) return res.json({ success: false, err });
                    res.status(200).json(doc.cart)
                }
            )
        }
    })

})

/**- Ruta para ELIMINAR guitarras del carrito.
 * - COMENTARIOS IMPORTANTES SOBRE FUNCIONAMIENTOS.
 */
app.get('/api/users/removeFromCart', auth, (req, res) => {

    User.findOneAndUpdate( //Encontrar el user y hacer updates en él.
        { _id: req.user._id }, //Tengo que PASAR qué user voy a actualizar (por ID); así que paso lo que haya tenido DE VUELTA de "auth"(!!).
        {
            "$pull": //Paso la acción que voy a tomar; ya hice "push", ahora tengo que eliminar => PULL (que necesita de un objeto).
                { "cart": { "id": mongoose.Types.ObjectId(req.query._id) } } /**-"Cart" es el lugar del cual voy a eliminar; luego paso un objeto.
                                                                         - Voy a eliminar algo con ID y voy a estar buscando por cualquier TYPE
                                                                         obtenido de la ruta "/removeFromCart?_id:...", y lo obtenemos de "req".*/
        },
        { new: true },//Después de hacer los cambios quiero el nuevo ESTADO del carrito del usuario como RESPUESTA, ya no quiero el viejo estado.  
        (err, doc) => {/**-Callback function: cuando tengamos el "doc" de vuelta quiero el nuevo estado de TODOS los elem del carrito.*/
            let cart = doc.cart;
            let array = cart.map(item => { //**- Loopeo el carrito; por cada loop voy a tener un "item" con ID; voy a ir obteniendo los IDs.*/
                return mongoose.Types.ObjectId(item.id) //El "id" que traigo va a ser convertido a "object types" (?).
            });

            Product.
                find({ '_id': { $in: array } }). //Encontrar los elementos con "_id" dentro de "Products" que coincidan con los elementos en "array".
                populate('brand').
                populate('wood').
                exec((err, cartDetail) => {
                    return res.status(200).json({ //La RESPUESTA va a tener todos los "detailProducts" y el NUEVO ESTADO del carrito (paso el carrito desde el SERVER y no desde el cliente). 
                        cartDetail,
                        cart
                    })
                })
        }
    );
})

/**
app.post('/api/users/successBuy', auth, (req, res) => {
    let history = [];
    let transactionData = {}

    // user history
    req.body.cartDetail.forEach((item) => {
        history.push({
            dateOfPurchase: Date.now(),
            name: item.name,
            brand: item.brand.name,
            id: item._id,
            price: item.price,
            quantity: item.quantity,
            paymentId: req.body.paymentData.paymentID
        })
    })

    //payments dash
    transactionData.user = {
        id: req.user._id,
        name: req.user.name,
        lastname: req.user.lastname,
        email: req.user.email
    }
    transactionData.data = req.body.paymentData;
    transactionData.product = history;

    User.findOneAndUpdate(
        { _id: req.user._id },
        { $push: { history: history }, $set: { cart: [] } },
        { new: true }, //Cuando uso "update" y quiero tener el documento actualizado del usuario tengo que hacer esto.  
        (err, user) => {
            if (err) return res.json({ success: false, err });

            const payment = new Payment(transactionData);
            payment.save((err, doc) => {
                if (err) return res.json({ success: false, err });
                let products = []; //Esto lo hago para crear un array para loopear en "async"; lo mismo la línea de abajo.
                doc.product.forEach(item => {
                    products.push({ id: item.id, quantity: item.quantity })
                })


                async.eachSeries(products, (item, callback) => { /** -De "NodeJS"; es para hacer una sola "callback" dsp de varias iteraciones (además sé cuándo estas terminan) 
                                                                -Esto lo uso para la posibilidad de que se compren varíos articulos.
                                                                -"eachSeries()" es como "forEach()"; necesita 3 argumentos: 1ro lo que voy a loopear (products), 2do lo que voy a hacer
                                                                 en esta itreación y 3ro lo que voy a hacer (otra callback, que es como "resolve-reject") depués del 2do paso.
                                                                -*/
/**                    Product.update(
                        { _id: item.id },
                        {
                            $inc: {
                                "sold": item.quantity
                            }
                        },
                        { new: false },
                        callback //es lo mismo que "()=>{}".
                    )
                }, (err) => {
                    if (err) return res.json({ success: false, err })
                    res.status(200).json({ //Esto es lo que le envío al client.
                        success: true,
                        cart: user.cart, //sería lo mismo a "[]" porque el carrito estaría vacío.
                        cartDetail: []
                    })
                })
            });
        }
    )
})*/


/**-El servidor necesita un puerto.
 * -Creo una "envirement variable" (.env) y traigo el puerto (.PORT), pero si no lo tengo (||), quiero hacerlo correr en el puerto 3002.
 */


app.post('/api/users/update_profile',auth,(req,res)=>{

    User.findOneAndUpdate( //puedo usar "findOne..." inmediatamente después de "User" porque estoy usando "auth".
        { _id: req.user._id },
        {
            "$set": req.body
        },
        { new: true },
        (err,doc)=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success:true
            })
        }
    );    
})


//=====================================================================================================================================
//                          SITE ROUTES
//=====================================================================================================================================

app.get('/api/site/site_data',(req,res)=>{
    Site.find({},(err,site)=>{
        if(err) return res.status(400).send(err);
        res.status(200).send(site[0].siteInfo) //quiero solo la info que está en "siteInfo".
    });
});

app.post('/api/site/site_data',auth,admin,(req,res)=>{
    Site.findOneAndUpdate(
        { name: 'Site' },
        { "$set": { siteInfo: req.body }},
        { mew: true },
        (err,doc)=>{
            if(err) return res.json({success:false,err});
            return res.status(200).send({
                success: true,
                siteInfo: doc.siteInfo
            })
        }
    )
})


const port = process.env.PORT || 3002;

app.listen(port, () => {
    console.log(`Server Running at ${port}`)
})