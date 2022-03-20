'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const voucherSchema = new schema({
    voucherId: { type: String, unique: true, required: true },
    discount:{ 
        type:Number,
        min:1,
        max:99
    },
    voucherDate : {type : Date, default : Date.now},
    expiryDate : {type : Date},

    expired : {type:Boolean , default : false}
});

const Vouchers = mongoose.model(config.dbvouchers, voucherSchema);

module.exports = Vouchers;