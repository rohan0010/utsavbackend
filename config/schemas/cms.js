
const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const cmsSchema = new schema({
    cmsId:{type:String, unique: true, required: true},
    html: String,
   

});

const cms = mongoose.model(config.dbcms, cmsSchema);

module.exports = cms;