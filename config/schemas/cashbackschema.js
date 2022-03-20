
const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const cashbackSchema = new schema({
    cashbackId: { type: String,  required: true },
    cashbackPercentage: {  
        type:Number,
        min:1,
        max:99 ,
        required: true
    },
    cashbackAmount: { type: Number },


});

const cashback = mongoose.model(config.dbcashback, cashbackSchema);

module.exports = cashback;