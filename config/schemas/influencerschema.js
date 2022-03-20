'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const influencerSchema = new schema({
    influencerId: { type: String, unique: true, required: true },
    influencerName: { type: String,required: true },
    purchaseCount:{type: Number, default: 0},
    discount:{ 
        type:Number,
        min:1,
        max:99
    },
    voucherDate : {type : Date, default : Date.now},
    expiryDate : {type : Date},
    expired : {type:Boolean , default : false}
});

const Influencers = mongoose.model(config.dbinfluencers, influencerSchema);

module.exports = Influencers;