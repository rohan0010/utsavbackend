const config = require("../config");
const mongoose = require("../connection");

const schema = mongoose.Schema;

const zipSchema = new schema({
    zipId: { type: String,  required: true },
    zipCode:Number,
    productId:[String]
    

});

const zip = mongoose.model(config.dbzip, zipSchema);

module.exports = zip;