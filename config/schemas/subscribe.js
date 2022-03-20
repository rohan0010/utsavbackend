
const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const subscribeSchema = new schema({
    subscribeId:{type:String, unique: true, required: true},
    email: [String],
   

});

const cms = mongoose.model(config.dbsubscribe, subscribeSchema);

module.exports = cms;