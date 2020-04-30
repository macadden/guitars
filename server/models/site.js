const mongoose = require('mongoose');

const siteSchema = mongoose.Schema({ //Hago un Array, donde "siteInfo" es la 1ra pos., porque quizás quiero agregar más elem. de distinta forma (?).
    featured:{
        required: true,
        type: Array,
        default:[]
    },
    siteInfo:{
        required: true,
        type: Array,
        default:[]  
    }  
});

const Site = mongoose.model('Site', siteSchema);

module.exports = { Site }