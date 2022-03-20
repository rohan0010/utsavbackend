
const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const catSchema = new schema({
    categoryid: { type: String,  required: true },
    categoryname: { type: String,  required: true },
    categorytype: { type: String,  required: true },
    description: { type: String,  required: true },
    priority:{type:Number,default:10000},
    delivery:{type:Number,default:15},
    imageUrls: [String],
    slug:String,
    active: {type:Boolean , default : false},
    parent:{type:mongoose.Schema.Types.ObjectId, ref:config.dbcatgry},
    subcategory:[{type:mongoose.Schema.Types.ObjectId, ref:config.dbcatgry}]

});

const cat = mongoose.model(config.dbcatgry, catSchema);

module.exports = cat;