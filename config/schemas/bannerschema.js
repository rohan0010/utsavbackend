
const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const bannerSchema = new schema({
    bannerId:{type:String, unique: true, required: true},
    content: [{
        "imageUrl":String,
        "text":String,
        "title":String,
        "subtitle":String,
        "buttonText":String,
        "redirectionUrl":String
    }]
   

});

const banner = mongoose.model(config.dbbanner, bannerSchema);

module.exports = banner;