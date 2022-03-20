'use strict';

const mongoose = require("../connection");
const config = require("../config");
const schema = mongoose.Schema;

const orderSchema = new schema({
    orderId: { type: String, unique: true, required: true },
    products : [{
        productId:String,
        slug:String,
        variantId: String,
        quantity:Number,
        imageUrl:String,
        userId:String,
        price:Number,
        tax:Number,
        trackStatus : String,
        title:String,
        variant1:{
            name: String,
            value: String, 
        },
        variant2:{
          name: String,
          value: String, 
      },
      skucode:String,
        price:Number,
        mrp:Number,
        isReturn:Boolean,
        returnStatus:String
    }],
    totaltax:Number,
    cashbackReceived:Number,
    grandTotal:Number,
    paymentMode:String,
    deliveryCharges:Number,
    invoiceUrl:String,
    totaldiscount:Number,
    type: String,
    trackStatus : String,
    total:Number,
    billing_address :{
     
        area: String,
        city: String,
        state: String,
        firstName:String,
        lastName:String,
        pincode: String,
        country: String
    },
    mobile:String,
    coupon : String,
    couponDiscount : Number,
    orderedBy : String,
    creditsUsed: Number,
    
    address :{
        firstName:String,
        lastName:String,
        area: String,
        city: String,
        state: String,
        pincode: String,
        country: String
    },

    orderedDate : {type : Date, default : Date.now},
    deliveryCharges : Number,
    transaction:String
});

const Orders = mongoose.model(config.dbOrders, orderSchema);

module.exports = Orders;