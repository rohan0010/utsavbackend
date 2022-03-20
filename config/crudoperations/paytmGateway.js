'use strict';

const logger = require("../logger");
const config = require('../config');
const utils = require("../utils");
var ObjectId = require('mongodb').ObjectId;
const { v4: uuidv4 } = require("uuid");

var PaytmChecksum = require("../PaytmChecksum");
var https=require("https")

const dbOperations = {

    generateChecksum : function (request,queryParam,txnid, cb) {

        var paytmParams = {};

        /* initialize an array */
        paytmParams.body = {
            "requestType"   : "Payment",
            "mid"           : config.paytmMID,
            "websiteName"   : "DEFAULT",
            "orderId"       : txnid.toString(),
            "callbackUrl"   :config.callbackUrl,
            "txnAmount"     : {
                "value"     : request.body.amount.toString(),
                "currency"  : "INR",
            },
            "userInfo"      : {
                "custId"    : request.userData.userId,
                "mobile":request.userData.mobile.toString(),
                "firstName":request.userData.userInfo.firstName,
                "lastName":request.userData.userInfo.lastName
            },
        };
        // (paytmParams["ADDRESS"] = '{add:sector3, rohini}');


      

        PaytmChecksum.generateSignature(JSON.stringify(paytmParams.body), config.merchantKey).then(function(checksum){
           console.log("checksumbangya",checksum)
            paytmParams.head = {
                "signature"    : checksum
            };
        
            var post_data = JSON.stringify(paytmParams);
        
            var options = {
        
                /* for Staging */
                // hostname: 'securegw-stage.paytm.in',
        
                /* for Production */
                hostname: 'securegw.paytm.in',
        
                port: 443,
                path: '/theia/api/v1/initiateTransaction?mid='+config.paytmMID+'&orderId='+txnid.toString(),
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': post_data.length
                }
            };
        
            var response = "";
            var post_req = https.request(options, function(post_res) {
                post_res.on('data', function (chunk) {
                    response += chunk;
                });
        
                post_res.on('end', function(){
                  
                    console.log('Response: ', response);
                    let send={}
                    send.orderId=txnid.toString()
                    send.txnToken=response
                    cb(null,send)
                });
            });
        
            post_req.write(post_data);
            post_req.end();
        });
    },

    generateChecksumMobile : function (request,queryParam,res) {

        var paytmParams = {};

        /* initialize an array */
        (paytmParams["MID"] = config.paytmMID),
            (paytmParams["ORDER_ID"] = request.body.orderId),//request.body.orderId.toString()),
            (paytmParams["TXN_AMOUNT"] = request.body.amount),
            (paytmParams["WEBSITE"] = 'DEFAULT'),
            (paytmParams["CHANNEL_ID"] = 'WEB'),
            (paytmParams["INDUSTRY_TYPE_ID"] = 'Retail'),
            (paytmParams["CALLBACK_URL"] = config.mobileCallbackUrl),
            (paytmParams["EMAIL"] = request.body.userEmail),
            (paytmParams["MOBILE_NO"] = request.body.mobile),
            (paytmParams["CUST_ID"] = 'txt');

        //console.log("paytmparams---",paytmParams)

        /**
         * Generate checksum by parameters we have
         * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
         */
        //console.log("generate-checksum-init----","init")

        var paytmChecksum = PaytmChecksum.generateSignature(paytmParams, config.merchantKey);
        paytmChecksum.then(function(checksum){
            paytmParams['CHECKSUMHASH' ] = checksum
            res.render('pgredirect.ejs', { 'restdata': paytmParams });


        }).catch(function(error){
            console.log("error--->",error)
        });
    },

    getPaymentStatus : function (request, cb) {
        /* import checksum generation utility */

        var paymentObj = {}
        var paytmChecksum = request.CHECKSUMHASH;
        delete request.CHECKSUMHASH;

        paymentObj["MID"] = config.paytmMID;
        paymentObj["ORDERID"] = request.orderId;
        paymentObj["AMOUNT"] = request.amount;
        //console.log("payment-obj---",paymentObj)
        var isVerifySignature = PaytmChecksum.verifySignature(paymentObj, config.merchantKey, paytmChecksum);
        if (isVerifySignature) {
            //console.log("Checksum Matched");
        } else {
            //console.log("Checksum Mismatched");
        }

    },
}


module.exports = dbOperations;