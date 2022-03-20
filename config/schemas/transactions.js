'use strict';

const mongoose = require("../connection");
const config = require("../config");
const utils = require("../utils");
const schema = mongoose.Schema;

const transactionSchema = new schema({

    transactionId: { type: String, unique: true, required: true },
    createdOn: {type: Date, default:Date.now},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: config.userCollection },

    amount: {type: Number, default:0},
    orderId: String,
    isCompleted: {type: Boolean, default:false}

});

const Order = mongoose.model(config.transactionCollection, transactionSchema);

module.exports = Order;